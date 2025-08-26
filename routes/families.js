const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../lib/middleware/auth');
const { validateRequest } = require('../middleware/validation');

const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Family:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/families:
 *   post:
 *     summary: Create a new family
 *     tags: [Families]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *     responses:
 *       201:
 *         description: Family created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Family'
 *       400:
 *         description: Invalid input
 */
router.post('/', 
  authenticate,
  validateRequest({
    name: 'required|string|min:2',
  }),
  async (req, res) => {
    try {
      const { name } = req.body;
      
      // Check if user is already in a family
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { familyId: true }
      });
      
      if (user.familyId) {
        return res.status(400).json({ error: 'User already belongs to a family' });
      }
      
      // Create family and update user's family association in a transaction
      const [family] = await prisma.$transaction([
        prisma.family.create({
          data: {
            name,
            members: {
              connect: { id: req.user.id }
            }
          },
        }),
        prisma.user.update({
          where: { id: req.user.id },
          data: { role: 'FAMILY_MEMBER' } // Update role to family member
        })
      ]);
      
      res.status(201).json(family);
    } catch (error) {
      console.error('Error creating family:', error);
      res.status(500).json({ error: 'Failed to create family' });
    }
  }
);

/**
 * @swagger
 * /api/families/members:
 *   get:
 *     summary: Get all family members
 *     tags: [Families]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of family members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: User not in a family
 */
router.get('/members', authenticate, async (req, res) => {
  try {
    // Get user with family and members
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        family: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
              }
            }
          }
        }
      }
    });
    
    if (!user.family) {
      return res.status(404).json({ error: 'User not in a family' });
    }
    
    res.json(user.family.members);
  } catch (error) {
    console.error('Error fetching family members:', error);
    res.status(500).json({ error: 'Failed to fetch family members' });
  }
});

/**
 * @swagger
 * /api/families/members/{userId}:
 *   delete:
 *     summary: Remove a member from the family (admin only)
 *     tags: [Families]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to remove
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       403:
 *         description: Not authorized to perform this action
 *       404:
 *         description: User or family not found
 */
router.delete('/members/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if current user is admin
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { familyId: true, role: true }
    });
    
    if (currentUser.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only admin can remove members' });
    }
    
    // Check if target user exists and is in the same family
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    });
    
    if (!targetUser || targetUser.familyId !== currentUser.familyId) {
      return res.status(404).json({ error: 'User not found in your family' });
    }
    
    // Remove user from family
    await prisma.user.update({
      where: { id: userId },
      data: { 
        familyId: null,
        role: 'GUEST'
      }
    });
    
    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Error removing family member:', error);
    res.status(500).json({ error: 'Failed to remove family member' });
  }
});

/**
 * @swagger
 * /api/families/invite:
 *   post:
 *     summary: Invite a user to join the family
 *     tags: [Families]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Invitation sent successfully
 *       400:
 *         description: User not found or already in a family
 */
router.post('/invite', 
  authenticate,
  validateRequest({
    email: 'required|email',
  }),
  async (req, res) => {
    try {
      const { email } = req.body;
      
      // Check if current user is in a family
      const currentUser = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { familyId: true, role: true }
      });
      
      if (!currentUser.familyId) {
        return res.status(400).json({ error: 'You are not in a family' });
      }
      
      // Check if target user exists and is not in a family
      const targetUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true, familyId: true }
      });
      
      if (!targetUser) {
        return res.status(400).json({ error: 'User not found' });
      }
      
      if (targetUser.familyId) {
        return res.status(400).json({ error: 'User already belongs to a family' });
      }
      
      // In a real app, you would send an email invitation here
      // For now, we'll just add them to the family
      await prisma.user.update({
        where: { email },
        data: { 
          familyId: currentUser.familyId,
          role: 'FAMILY_MEMBER'
        }
      });
      
      res.json({ message: 'User added to family successfully' });
    } catch (error) {
      console.error('Error inviting user to family:', error);
      res.status(500).json({ error: 'Failed to invite user to family' });
    }
  }
);

module.exports = router;

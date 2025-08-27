/**
 * @swagger
 * components:
 *   schemas:
 *     Family:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the family
 *         name:
 *           type: string
 *           description: The name of the family
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the family was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the family was last updated
 *         members:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *           description: Members of the family
 *       example:
 *         id: 550e8400-e29b-41d4-a716-446655440000
 *         name: The Smith Family
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 *
 *     FamilyMember:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [ADMIN, FAMILY_MEMBER, GUEST]
 *         joinedAt:
 *           type: string
 *           format: date-time
 *
 *     FamilyInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *           example: The Smith Family
 *
 *     InviteInput:
 *       type: object
 *       required:
 *         - email
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         role:
 *           type: string
 *           enum: [FAMILY_MEMBER, GUEST]
 *           default: FAMILY_MEMBER
 *           example: FAMILY_MEMBER
 */

/**
 * @swagger
 * tags:
 *   name: Families
 *   description: Family management and membership
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
 *             $ref: '#/components/schemas/FamilyInput'
 *     responses:
 *       201:
 *         description: Family created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Family'
 *       400:
 *         description: Invalid input or user already in a family
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *
 *   get:
 *     summary: Get current user's family details
 *     tags: [Families]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Family details with members
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Family'
 *       404:
 *         description: User is not part of any family
 *       500:
 *         description: Server error
 */

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
 *                 $ref: '#/components/schemas/FamilyMember'
 *       400:
 *         description: User is not part of a family
 *       500:
 *         description: Server error
 *
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
 *           format: uuid
 *         description: ID of the user to remove
 *     responses:
 *       204:
 *         description: Member removed successfully
 *       400:
 *         description: Cannot remove self or invalid request
 *       403:
 *         description: Not authorized to remove members
 *       404:
 *         description: User or family not found
 *       500:
 *         description: Server error
 *
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
 *             $ref: '#/components/schemas/InviteInput'
 *     responses:
 *       200:
 *         description: User invited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input or user already in a family
 *       403:
 *         description: Not authorized to invite users
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

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
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         completed:
 *           type: boolean
 *         completedAt:
 *           type: string
 *           format: date-time
 *         dueDate:
 *           type: string
 *           format: date-time
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *         repeatFrequency:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         creatorId:
 *           type: string
 *         familyId:
 *           type: string
 *         categoryId:
 *           type: string
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the current user's family
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/', authenticate, async (req, res) => {
  try {
    // Get user's family ID
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { familyId: true }
    });

    if (!user.familyId) {
      return res.status(400).json({ error: 'User is not part of a family' });
    }

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { familyId: user.familyId },
          { creatorId: req.user.id }
        ]
      },
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Verify the user has access to this task
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { familyId: true }
    });

    if (task.familyId !== user.familyId && task.creatorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access this task' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               repeatFrequency:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.post('/', 
  authenticate,
  validateRequest({
    title: 'required|string|min:2|max:255',
    description: 'string',
    dueDate: 'date',
    priority: 'in:Low,Medium,High',
    repeatFrequency: 'string',
    categoryId: 'string|uuid'
  }),
  async (req, res) => {
    try {
      const { title, description, dueDate, priority, repeatFrequency, categoryId } = req.body;
      
      // Get user's family ID
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { familyId: true }
      });

      if (!user.familyId) {
        return res.status(400).json({ error: 'User is not part of a family' });
      }

      // Create the task
      const task = await prisma.task.create({
        data: {
          title,
          description,
          dueDate: dueDate ? new Date(dueDate) : null,
          priority,
          repeatFrequency,
          creator: {
            connect: { id: req.user.id }
          },
          family: {
            connect: { id: user.familyId }
          },
          ...(categoryId && {
            category: {
              connect: { id: categoryId }
            }
          })
        },
        include: {
          category: true
        }
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  }
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               repeatFrequency:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       403:
 *         description: Not authorized to update this task
 *       404:
 *         description: Task not found
 */
router.put('/:id', 
  authenticate,
  validateRequest({
    title: 'string|min:2|max:255',
    description: 'string',
    completed: 'boolean',
    dueDate: 'date',
    priority: 'in:Low,Medium,High',
    repeatFrequency: 'string',
    categoryId: 'string|uuid'
  }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, completed, dueDate, priority, repeatFrequency, categoryId } = req.body;

      // Check if task exists and user has permission
      const existingTask = await prisma.task.findUnique({
        where: { id },
        select: { creatorId: true, familyId: true }
      });

      if (!existingTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { familyId: true }
      });

      if (existingTask.familyId !== user.familyId && existingTask.creatorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this task' });
      }

      // Update the task
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(completed !== undefined && { 
            completed,
            completedAt: completed ? new Date() : null 
          }),
          ...(dueDate && { dueDate: new Date(dueDate) }),
          ...(priority && { priority }),
          ...(repeatFrequency !== undefined && { repeatFrequency }),
          ...(categoryId && {
            category: {
              connect: { id: categoryId }
            }
          })
        },
        include: {
          category: true
        }
      });

      res.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'Failed to update task' });
    }
  }
);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       403:
 *         description: Not authorized to delete this task
 *       404:
 *         description: Task not found
 */
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists and user has permission
    const task = await prisma.task.findUnique({
      where: { id },
      select: { creatorId: true, familyId: true }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { familyId: true, role: true }
    });

    // Only allow deletion by the creator or admin
    if (task.creatorId !== req.user.id && user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }

    await prisma.task.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;

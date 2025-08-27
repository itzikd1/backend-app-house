const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../lib/middleware/auth');
const { validateRequest } = require('../middleware/validation');

const prisma = new PrismaClient();
router.get('/', authenticate, async (req, res) => {
  try {
    console.log('User from auth middleware:', req.user); // Debug log
    
    if (!req.user || !req.user.id) {
      console.error('No user ID found in request');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Get user's family ID
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { 
        id: true,
        familyId: true 
      }
    });

    if (!user) {
      console.error('User not found in database');
      return res.status(404).json({ error: 'User not found' });
    }

    // User can have personal tasks even if not in a family
    console.log(`Fetching tasks for user ${user.id}${user.familyId ? ' in family ' + user.familyId : ' (personal tasks only)'}`);

    console.log(`Fetching tasks for user ${user.id} in family ${user.familyId}`);
    
    // Query tasks: user's personal tasks + family tasks (if in a family)
    const whereClause = user.familyId 
      ? {
          OR: [
            { familyId: user.familyId },
            { creatorId: user.id, familyId: null } // Personal tasks
          ]
        }
      : { creatorId: user.id, familyId: null }; // Only personal tasks

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        category: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
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

    if (task.familyId && task.familyId !== user.familyId && task.creatorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to access this task' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});


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
        select: { 
          id: true,
          familyId: true 
        }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // User can create tasks even if not in a family

      // Check if category exists if provided
      if (categoryId) {
        const category = await prisma.category.findUnique({
          where: { id: categoryId }
        });
        
        if (!category) {
          return res.status(404).json({ 
            error: 'Category not found',
            details: `No category found with ID: ${categoryId}`
          });
        }
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
            connect: { id: user.id }
          },
          ...(user.familyId && {
            family: {
              connect: { id: user.familyId }
            }
          }),
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

      res.status(201).json({
        success: true,
        data: task
      });
    } catch (error) {
      console.error('Error creating task:', error);
      
      // Handle specific Prisma errors
      if (error.code === 'P2025') {
        return res.status(404).json({
          error: 'Related record not found',
          details: error.meta?.cause || 'A related record required for this operation was not found'
        });
      }
      
      res.status(500).json({ 
        error: 'Failed to create task',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
);


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

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getTasks = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, familyId: true }
    });
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    const whereClause = user.familyId
      ? {
          OR: [
            { familyId: user.familyId },
            { creatorId: user.id, familyId: null }
          ]
        }
      : { creatorId: user.id, familyId: null };
    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        category: true,
        creator: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    next(error);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        creator: { select: { id: true, name: true, email: true } }
      }
    });
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { familyId: true }
    });
    if (task.familyId && task.familyId !== user.familyId && task.creatorId !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to access this task' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, completed, repeatFrequency, priority, dueDate, categoryId, familyId } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    const task = await prisma.task.create({
      data: {
        title,
        description,
        completed: completed || false,
        repeatFrequency,
        priority,
        dueDate,
        categoryId,
        familyId,
        creatorId: req.user.id,
      },
    });
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const task = await prisma.task.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({ where: { id } });
    res.status(204).json({ success: true });
  } catch (error) {
    next(error);
  }
};

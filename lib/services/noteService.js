const prisma = require('../prisma');

exports.getAllNotes = async (userId) => {
  return prisma.note.findMany({ where: { userId } });
};

exports.getNoteById = async (userId, noteId) => {
  return prisma.note.findFirst({ where: { id: noteId, userId } });
};

exports.createNote = async (userId, data) => {
  const { title, content, isPinned, color, familyId } = data;
  if (!title) throw new Error('Missing required field: title');
  return prisma.note.create({
    data: {
      title,
      content,
      isPinned,
      color,
      userId,
      familyId,
    },
  });
};

exports.updateNote = async (userId, noteId, data) => {
  const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!note) return null;
  return prisma.note.update({
    where: { id: noteId },
    data,
  });
};

exports.deleteNote = async (userId, noteId) => {
  const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!note) return null;
  return prisma.note.delete({ where: { id: noteId } });
};


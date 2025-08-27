const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createNote = async (data) => prisma.note.create({ data });
const getNotes = async () => prisma.note.findMany();
const getNoteById = async (id) => prisma.note.findUnique({ where: { id } });
const updateNote = async (id, data) => prisma.note.update({ where: { id }, data });
const deleteNote = async (id) => prisma.note.delete({ where: { id } });

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};


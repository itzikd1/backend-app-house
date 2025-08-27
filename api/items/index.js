// Import Prisma client
const prisma = require('../../lib/prisma');
const { verifyToken } = require('../../src/middleware/auth.middleware');

// Vercel Serverless Function for items API
// @route   GET/POST/PUT/DELETE /api/items
// @access  Private
module.exports = async (req, res) => {
  // Verify token and get user ID
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  let userId;
  try {
    const decoded = await new Promise((resolve, reject) => {
      verifyToken(req, { json: (obj) => reject(obj) }, () => {
        resolve(req.userId);
      });
    });
    userId = decoded;
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET request - Get all items
  if (req.method === 'GET') {
    try {
      const items = await prisma.item.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return res.status(200).json(items);
    } catch (err) {
      console.error('Error fetching items:', err);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }

  // Handle POST request - Create new item
  if (req.method === 'POST') {
    try {
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ 
          error: 'Item name is required' 
        });
      }
      
      const newItem = await prisma.item.create({
        data: {
          name: name,
          userId: userId
        },
      });
      
      return res.status(201).json({
        message: 'Item created successfully',
        item: newItem
      });
    } catch (err) {
      console.error('Error creating item:', err);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }

  // Handle PUT request - Update existing item
  if (req.method === 'PUT') {
    try {
      const { id, name } = req.body;
      
      if (!id || !name) {
        return res.status(400).json({ 
          error: 'Item ID and name are required' 
        });
      }
      
      // Check if item exists and belongs to user
      const existingItem = await prisma.item.findFirst({
        where: { 
          id: id,
          userId: userId 
        },
      });
      
      if (!existingItem) {
        return res.status(404).json({ 
          error: 'Item not found or access denied' 
        });
      }
      
      const updatedItem = await prisma.item.update({
        where: { id: id },
        data: { name: name },
      });
      
      return res.status(200).json({ 
        message: 'Item updated successfully',
        item: updatedItem 
      });
    } catch (err) {
      console.error('Error updating item:', err);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }

  // Handle DELETE request - Delete item
  if (req.method === 'DELETE') {
    try {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ 
          error: 'Item ID is required' 
        });
      }
      
      // Check if item exists and belongs to user
      const existingItem = await prisma.item.findFirst({
        where: { 
          id: id,
          userId: userId 
        },
      });
      
      if (!existingItem) {
        return res.status(404).json({ 
          error: 'Item not found or access denied' 
        });
      }
      
      await prisma.item.delete({
        where: { id: id },
      });
      
      return res.status(200).json({ 
        message: 'Item deleted successfully',
      });
    } catch (err) {
      console.error('Error deleting item:', err);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }

  // Handle unsupported methods
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
  return res.status(405).json({ 
    error: `Method ${req.method} Not Allowed` 
  });
};

// In-memory storage for demo purposes
// In a real app, this would be a database
let items = ["Item 1", "Item 2", "Item 3"];

// Vercel Serverless Function for items API
// @route   GET/PUT/DELETE /api/items
// @access  Public
module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET request
  if (req.method === 'GET') {
    try {
      return res.status(200).json(items);
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }

  // Handle PUT request
  if (req.method === 'PUT') {
    try {
      const { index, value } = req.body;
      
      if (index === undefined || value === undefined) {
        return res.status(400).json({ 
          error: 'Index and value are required' 
        });
      }
      
      if (index < 0 || index >= items.length) {
        return res.status(404).json({ 
          error: 'Item not found' 
        });
      }
      
      items[index] = value;
      return res.status(200).json({ 
        message: 'Item updated successfully',
        items 
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }

  // Handle DELETE request
  if (req.method === 'DELETE') {
    try {
      const { index } = req.body;
      
      if (index === undefined) {
        return res.status(400).json({ 
          error: 'Index is required' 
        });
      }
      
      if (index < 0 || index >= items.length) {
        return res.status(404).json({ 
          error: 'Item not found' 
        });
      }
      
      const deletedItem = items.splice(index, 1);
      return res.status(200).json({ 
        message: 'Item deleted successfully',
        deletedItem,
        items
      });
    } catch (err) {
      console.error('Error:', err);
      return res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  }

  // Handle unsupported methods
  res.setHeader('Allow', ['GET', 'PUT', 'DELETE', 'OPTIONS']);
  return res.status(405).json({ 
    error: `Method ${req.method} Not Allowed` 
  });
};

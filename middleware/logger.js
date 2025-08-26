// middleware/logger.js

/**
 * Request logging middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const logger = (req, res, next) => {
  const start = Date.now();
  
  // Log request details
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  
  // Log request body (except for sensitive data)
  if (Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body));
  }
  
  // Log query parameters
  if (Object.keys(req.query).length > 0) {
    console.log('Query Params:', JSON.stringify(req.query));
  }
  
  // Log response details when the response is sent
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

module.exports = logger;

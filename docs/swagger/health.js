/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Uptime in seconds
 *                 nodeVersion:
 *                   type: string
 *                   example: v18.0.0
 *                 environment:
 *                   type: string
 *                   example: production
 *                 region:
 *                   type: string
 *                   example: local
 *                 deployment:
 *                   type: string
 *                   example: vercel
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: connected
 *                     message:
 *                       type: string
 *                       example: Database connection successful
 *       503:
 *         description: Service Unavailable - Database connection failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 database:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: disconnected
 *                     message:
 *                       type: string
 *                       example: Failed to connect to database
 *                     error:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         message:
 *                           type: string
 */

module.exports = {
  // This file only contains JSDoc comments for Swagger
};

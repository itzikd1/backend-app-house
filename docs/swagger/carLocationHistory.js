/**
 * @swagger
 * tags:
 *   name: CarLocationHistory
 *   description: Car location history management
 */

/**
 * @swagger
 * /carLocationHistory:
 *   post:
 *     summary: Create a new car location history
 *     tags: [CarLocationHistory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarLocationHistory'
 *     responses:
 *       201:
 *         description: Car location history created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarLocationHistory'
 *   get:
 *     summary: Get all car location histories
 *     tags: [CarLocationHistory]
 *     responses:
 *       200:
 *         description: List of car location histories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CarLocationHistory'
 * /carLocationHistory/{id}:
 *   get:
 *     summary: Get car location history by ID
 *     tags: [CarLocationHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car location history found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarLocationHistory'
 *   put:
 *     summary: Update car location history
 *     tags: [CarLocationHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CarLocationHistory'
 *     responses:
 *       200:
 *         description: Car location history updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CarLocationHistory'
 *   delete:
 *     summary: Delete car location history
 *     tags: [CarLocationHistory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Car location history deleted
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CarLocationHistory:
 *       type: object
 *       required:
 *         - carId
 *         - userId
 *         - location
 *       properties:
 *         id:
 *           type: string
 *         carId:
 *           type: string
 *         userId:
 *           type: string
 *         location:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */


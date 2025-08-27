/**
 * @swagger
 * tags:
 *   name: Car
 *   description: Car management
 */

/**
 * @swagger
 * /car:
 *   post:
 *     summary: Create a new car
 *     tags: [Car]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       201:
 *         description: Car created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *   get:
 *     summary: Get all cars
 *     tags: [Car]
 *     responses:
 *       200:
 *         description: List of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 * /car/{id}:
 *   get:
 *     summary: Get car by ID
 *     tags: [Car]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *   put:
 *     summary: Update car
 *     tags: [Car]
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
 *             $ref: '#/components/schemas/Car'
 *     responses:
 *       200:
 *         description: Car updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Car'
 *   delete:
 *     summary: Delete car
 *     tags: [Car]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Car deleted
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Car:
 *       type: object
 *       required:
 *         - model
 *         - familyId
 *       properties:
 *         id:
 *           type: string
 *         model:
 *           type: string
 *         familyId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */


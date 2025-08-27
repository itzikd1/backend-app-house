/**
 * @swagger
 * tags:
 *   name: Goal
 *   description: Goal management
 */

/**
 * @swagger
 * /goal:
 *   post:
 *     summary: Create a new goal
 *     tags: [Goal]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Goal'
 *     responses:
 *       201:
 *         description: Goal created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 *   get:
 *     summary: Get all goals
 *     tags: [Goal]
 *     responses:
 *       200:
 *         description: List of goals
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Goal'
 * /goal/{id}:
 *   get:
 *     summary: Get goal by ID
 *     tags: [Goal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Goal found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 *   put:
 *     summary: Update goal
 *     tags: [Goal]
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
 *             $ref: '#/components/schemas/Goal'
 *     responses:
 *       200:
 *         description: Goal updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Goal'
 *   delete:
 *     summary: Delete goal
 *     tags: [Goal]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Goal deleted
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Goal:
 *       type: object
 *       required:
 *         - title
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         userId:
 *           type: string
 *         targetDate:
 *           type: string
 *           format: date-time
 *         progress:
 *           type: integer
 *         isCompleted:
 *           type: boolean
 *         completedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */


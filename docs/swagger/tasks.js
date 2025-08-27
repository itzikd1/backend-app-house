/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *           example: "cmeti79jt0002ul0saico49fl"
 *           description: The auto-generated ID of the task (alphanumeric, 24 characters)
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: Detailed description of the task
 *         completed:
 *           type: boolean
 *           description: Whether the task is completed
 *         completedAt:
 *           type: string
 *           format: date-time
 *           description: When the task was completed
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: When the task is due
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *           description: Priority level of the task
 *         repeatFrequency:
 *           type: string
 *           description: How often the task repeats (e.g., daily, weekly)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: When the task was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: When the task was last updated
 *         creatorId:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *           example: "cmet3ubly0000ulywceu2aau9"
 *           description: ID of the user who created the task
 *         familyId:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *           example: "cmet3wmp40001ulywjf7rj6m2"
 *           description: ID of the family this task belongs to
 *         categoryId:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *           example: "cmet3wmp40001ulywjf7rj6m2"
 *           description: ID of the task's category
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         creator:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               pattern: '^[a-z0-9]{24}$'
 *             name:
 *               type: string
 *             email:
 *               type: string
 *       example:
 *         id: cmeti79jt0002ul0saico49fl
 *         title: Weekly Groceries
 *         description: Buy milk, eggs, and bread
 *         completed: false
 *         dueDate: 2023-12-31T23:59:59.999Z
 *         priority: Medium
 *         repeatFrequency: weekly
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 *         creatorId: cmet3ubly0000ulywceu2aau9
 *         familyId: cmet3wmp40001ulywjf7rj6m2
 *         categoryId: cmet3wmp40001ulywjf7rj6m2
 *
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *         name:
 *           type: string
 *         color:
 *           type: string
 *         icon:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         familyId:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *
 *     TaskInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           minLength: 2
 *           maxLength: 255
 *         description:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date-time
 *         priority:
 *           type: string
 *           enum: [Low, Medium, High]
 *         repeatFrequency:
 *           type: string
 *         categoryId:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 */

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks for the current user's family
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: User is not part of a family
 *       500:
 *         description: Failed to fetch tasks
 *
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input or user not part of a family
 *       500:
 *         description: Failed to create task
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a single task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *           example: "cmeti79jt0002ul0saico49fl"
 *         description: Task ID (24-character alphanumeric)
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       403:
 *         description: Not authorized to access this task
 *       404:
 *         description: Task not found
 *       500:
 *         description: Failed to fetch task
 *
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *           example: "cmeti79jt0002ul0saico49fl"
 *         description: Task ID (24-character alphanumeric)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       403:
 *         description: Not authorized to update this task
 *       404:
 *         description: Task not found
 *       500:
 *         description: Failed to update task
 *
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-z0-9]{24}$'
 *           example: "cmeti79jt0002ul0saico49fl"
 *         description: Task ID (24-character alphanumeric)
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       403:
 *         description: Not authorized to delete this task
 *       404:
 *         description: Task not found
 *       500:
 *         description: Failed to delete task
 */

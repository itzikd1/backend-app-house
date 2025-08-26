/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated ID of the item
 *         name:
 *           type: string
 *           description: The item name
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the item was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the item was last updated
 *       example:
 *         id: d5fE_asz
 *         name: Sample Item
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: A list of items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The item name
 *                 example: New Item
 *     responses:
 *       201:
 *         description: The created item
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *   put:
 *     summary: Update an existing item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: string
 *                 description: The item ID
 *               name:
 *                 type: string
 *                 description: The new item name
 *     responses:
 *       200:
 *         description: The updated item
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: The item ID to delete
 *     responses:
 *       200:
 *         description: The deleted item
 */

module.exports = {
  // This file only contains JSDoc comments for Swagger
};

/**
 * @swagger
 * tags:
 *   name: SavedShoppingList
 *   description: Saved shopping list management
 */

/**
 * @swagger
 * /savedShoppingList:
 *   post:
 *     summary: Create a new saved shopping list
 *     tags: [SavedShoppingList]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SavedShoppingList'
 *     responses:
 *       201:
 *         description: Saved shopping list created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedShoppingList'
 *   get:
 *     summary: Get all saved shopping lists
 *     tags: [SavedShoppingList]
 *     responses:
 *       200:
 *         description: List of saved shopping lists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavedShoppingList'
 * /savedShoppingList/{id}:
 *   get:
 *     summary: Get saved shopping list by ID
 *     tags: [SavedShoppingList]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Saved shopping list found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedShoppingList'
 *   put:
 *     summary: Update saved shopping list
 *     tags: [SavedShoppingList]
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
 *             $ref: '#/components/schemas/SavedShoppingList'
 *     responses:
 *       200:
 *         description: Saved shopping list updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedShoppingList'
 *   delete:
 *     summary: Delete saved shopping list
 *     tags: [SavedShoppingList]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Saved shopping list deleted
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SavedShoppingList:
 *       type: object
 *       required:
 *         - name
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         userId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */


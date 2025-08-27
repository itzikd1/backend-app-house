/**
 * @swagger
 * tags:
 *   name: SavedShoppingListItem
 *   description: Saved shopping list item management
 */

/**
 * @swagger
 * /savedShoppingListItem:
 *   post:
 *     summary: Create a new saved shopping list item
 *     tags: [SavedShoppingListItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SavedShoppingListItem'
 *     responses:
 *       201:
 *         description: Saved shopping list item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedShoppingListItem'
 *   get:
 *     summary: Get all saved shopping list items
 *     tags: [SavedShoppingListItem]
 *     responses:
 *       200:
 *         description: List of saved shopping list items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavedShoppingListItem'
 * /savedShoppingListItem/{id}:
 *   get:
 *     summary: Get saved shopping list item by ID
 *     tags: [SavedShoppingListItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Saved shopping list item found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedShoppingListItem'
 *   put:
 *     summary: Update saved shopping list item
 *     tags: [SavedShoppingListItem]
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
 *             $ref: '#/components/schemas/SavedShoppingListItem'
 *     responses:
 *       200:
 *         description: Saved shopping list item updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedShoppingListItem'
 *   delete:
 *     summary: Delete saved shopping list item
 *     tags: [SavedShoppingListItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Saved shopping list item deleted
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SavedShoppingListItem:
 *       type: object
 *       required:
 *         - name
 *         - familyId
 *       properties:
 *         id:
 *           type: string
 *         name:
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


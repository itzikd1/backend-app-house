/**
 * @swagger
 * tags:
 *   name: SavedShoppingListItem
 *   description: Saved shopping list item management
 */

/**
 * @swagger
 * /api/savedShoppingListItem:
 *   post:
 *     summary: Create a new saved shopping list item
 *     tags: [SavedShoppingListItem]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Eggs"
 *               quantity:
 *                 type: integer
 *                 example: 12
 *               notes:
 *                 type: string
 *                 example: "Free range"
 *     responses:
 *       201:
 *         description: Saved shopping list item created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/SavedShoppingListItem'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Get all saved shopping list items
 *     tags: [SavedShoppingListItem]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved shopping list items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/SavedShoppingListItem'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 * /api/savedShoppingListItem/{id}:
 *   get:
 *     summary: Get saved shopping list item by ID
 *     tags: [SavedShoppingListItem]
 *     security:
 *       - bearerAuth: []
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
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/SavedShoppingListItem'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update a saved shopping list item
 *     tags: [SavedShoppingListItem]
 *     security:
 *       - bearerAuth: []
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
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Eggs"
 *               quantity:
 *                 type: integer
 *                 example: 12
 *               notes:
 *                 type: string
 *                 example: "Free range"
 *     responses:
 *       200:
 *         description: Saved shopping list item updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/SavedShoppingListItem'
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete a saved shopping list item
 *     tags: [SavedShoppingListItem]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Saved shopping list item deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SavedShoppingListItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         quantity:
 *           type: integer
 *         notes:
 *           type: string
 *         savedShoppingListId:
 *           type: string
 *         userId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 */

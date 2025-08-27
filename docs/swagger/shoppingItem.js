/**
 * @swagger
 * tags:
 *   name: ShoppingItem
 *   description: Shopping item management
 */

/**
 * @swagger
 * /shoppingItem:
 *   post:
 *     summary: Create a new shopping item
 *     tags: [ShoppingItem]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShoppingItem'
 *     responses:
 *       201:
 *         description: Shopping item created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingItem'
 *   get:
 *     summary: Get all shopping items
 *     tags: [ShoppingItem]
 *     responses:
 *       200:
 *         description: List of shopping items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ShoppingItem'
 * /shoppingItem/{id}:
 *   get:
 *     summary: Get shopping item by ID
 *     tags: [ShoppingItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shopping item found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingItem'
 *   put:
 *     summary: Update shopping item
 *     tags: [ShoppingItem]
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
 *             $ref: '#/components/schemas/ShoppingItem'
 *     responses:
 *       200:
 *         description: Shopping item updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ShoppingItem'
 *   delete:
 *     summary: Delete shopping item
 *     tags: [ShoppingItem]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Shopping item deleted
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ShoppingItem:
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


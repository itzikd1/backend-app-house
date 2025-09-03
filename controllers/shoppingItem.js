const shoppingItemService = require('../lib/services/shoppingItemService');

const getAllShoppingItems = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({data: {success: false, error: 'User not authenticated'}});
        }
        let items = await shoppingItemService.getAllShoppingItems({creatorId: req.user.id});
        if (items === null) {
            return res.status(404).json({data: {success: false, error: 'User not found'}});
        }
        // Optional: filter by purchased status if query param exists
        if (req.query.purchased !== undefined) {
            const purchased = req.query.purchased === 'true';
            items = items.filter(item => item.purchased === purchased);
        }
        return res.json({data: {success: true, item: items}});
    } catch (error) {
        return res.status(500).json({data: {success: false, error: 'Failed to fetch shopping items'}});
    }
};

const getShoppingItemById = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({data: {success: false, error: 'User not authenticated'}});
        }
        const item = await shoppingItemService.getShoppingItemById(Number(req.params.id));
        if (!item || item.creatorId !== req.user.id) {
            return res.status(404).json({data: {success: false, error: 'Item not found'}});
        }
        return res.json({data: {success: true, item}});
    } catch (error) {
        return res.status(500).json({data: {success: false, error: 'Failed to fetch shopping item'}});
    }
};

const createShoppingItem = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({data: {success: false, error: 'User not authenticated'}});
        }
        const data = {
            ...req.body,
            creator: {connect: {id: req.user.id}},
        };
        const item = await shoppingItemService.createShoppingItem(data);
        return res.status(201).json({data: {success: true, item}});
    } catch (error) {
        return res.status(500).json({data: {success: false, error: 'Failed to create shopping item'}});
    }
};

const updateShoppingItem = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({data: {success: false, error: 'User not authenticated'}});
        }
        const item = await shoppingItemService.getShoppingItemById(Number(req.params.id));
        if (!item || item.creatorId !== req.user.id) {
            return res.status(404).json({data: {success: false, error: 'Item not found'}});
        }
        const updatedItem = await shoppingItemService.updateShoppingItem(Number(req.params.id), req.body);
        return res.json({data: {success: true, item: updatedItem}});
    } catch (error) {
        return res.status(500).json({data: {success: false, error: 'Failed to update shopping item'}});
    }
};

const deleteShoppingItem = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({data: {success: false, error: 'User not authenticated'}});
        }
        const item = await shoppingItemService.getShoppingItemById(Number(req.params.id));
        if (!item || item.creatorId !== req.user.id) {
            return res.status(404).json({data: {success: false, error: 'Item not found'}});
        }
        await shoppingItemService.deleteShoppingItem(Number(req.params.id));
        return res.json({data: {success: true, message: 'Item deleted'}});
    } catch (error) {
        return res.status(500).json({data: {success: false, error: 'Failed to delete shopping item'}});
    }
};

module.exports = {
    getAllShoppingItems,
    getShoppingItemById,
    createShoppingItem,
    updateShoppingItem,
    deleteShoppingItem,
};

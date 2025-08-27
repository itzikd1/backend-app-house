const shoppingItemService = require('../shoppingItemService');
const prisma = require('../../prisma');

describe('shoppingItemService', () => {
  beforeEach(() => {
    prisma.shoppingItem = {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
  });

  describe('createShoppingItem', () => {
    it('should create a shopping item with valid data', async () => {
      const data = { name: 'Milk', quantity: 2 };
      prisma.shoppingItem.create.mockResolvedValue({ id: 'item1', ...data });
      const item = await shoppingItemService.createShoppingItem(data);
      expect(item).toEqual({ id: 'item1', ...data });
    });
    it('should throw error for invalid data', async () => {
      prisma.shoppingItem.create.mockRejectedValue(new Error('Invalid data'));
      await expect(shoppingItemService.createShoppingItem({})).rejects.toThrow('Invalid data');
    });
  });

  describe('getShoppingItemById', () => {
    it('should return item for valid ID', async () => {
      prisma.shoppingItem.findUnique.mockResolvedValue({ id: 'item1', name: 'Milk', quantity: 2 });
      const item = await shoppingItemService.getShoppingItemById('item1');
      expect(item).toEqual({ id: 'item1', name: 'Milk', quantity: 2 });
    });
    it('should return null for invalid ID', async () => {
      prisma.shoppingItem.findUnique.mockResolvedValue(null);
      const item = await shoppingItemService.getShoppingItemById('invalid');
      expect(item).toBeNull();
    });
    it('should handle errors from Prisma', async () => {
      prisma.shoppingItem.findUnique.mockRejectedValue(new Error('DB error'));
      await expect(shoppingItemService.getShoppingItemById('item1')).rejects.toThrow('DB error');
    });
  });

  describe('getAllShoppingItems', () => {
    it('should return all items', async () => {
      const items = [
        { id: 'item1', name: 'Milk', quantity: 2 },
        { id: 'item2', name: 'Eggs', quantity: 12 },
      ];
      prisma.shoppingItem.findMany.mockResolvedValue(items);
      const result = await shoppingItemService.getAllShoppingItems();
      expect(result).toEqual(items);
    });
    it('should filter items by name', async () => {
      const items = [{ id: 'item1', name: 'Milk', quantity: 2 }];
      prisma.shoppingItem.findMany.mockResolvedValue(items);
      const result = await shoppingItemService.getAllShoppingItems({ name: 'Milk' });
      expect(result).toEqual(items);
    });
    it('should handle errors from Prisma', async () => {
      prisma.shoppingItem.findMany.mockRejectedValue(new Error('DB error'));
      await expect(shoppingItemService.getAllShoppingItems()).rejects.toThrow('DB error');
    });
  });

  describe('updateShoppingItem', () => {
    it('should update item with valid data', async () => {
      const data = { name: 'Milk', quantity: 3 };
      prisma.shoppingItem.update.mockResolvedValue({ id: 'item1', ...data });
      const item = await shoppingItemService.updateShoppingItem('item1', data);
      expect(item).toEqual({ id: 'item1', ...data });
    });
    it('should throw error for invalid data', async () => {
      prisma.shoppingItem.update.mockRejectedValue(new Error('Invalid data'));
      await expect(shoppingItemService.updateShoppingItem('item1', {})).rejects.toThrow('Invalid data');
    });
  });

  describe('deleteShoppingItem', () => {
    it('should delete item by ID', async () => {
      prisma.shoppingItem.delete.mockResolvedValue({ id: 'item1', name: 'Milk', quantity: 2 });
      const item = await shoppingItemService.deleteShoppingItem('item1');
      expect(item).toEqual({ id: 'item1', name: 'Milk', quantity: 2 });
    });
    it('should handle deleting non-existent item gracefully', async () => {
      prisma.shoppingItem.delete.mockRejectedValue(new Error('Item not found'));
      await expect(shoppingItemService.deleteShoppingItem('nonexistent')).rejects.toThrow('Item not found');
    });
  });
});


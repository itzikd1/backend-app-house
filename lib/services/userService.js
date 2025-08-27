const prisma = require('../prisma');

const userService = {
  /**
   * Find a user by email
   * @param {string} email - User's email
   * @returns {Promise<Object|null>} User object or null if not found
   */
  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async create(userData) {
    return prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  },

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  async findById(id) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  },

  /**
   * Get all users
   * @returns {Promise<Array>} Array of user objects
   */
  async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
  },

  /**
   * Delete a user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} Deleted user
   */
  async delete(id) {
    try {
      return await prisma.user.delete({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      });
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userService;

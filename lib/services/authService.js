const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userService = require('./userService');
const { JWT_SECRET } = process.env;

const authService = {
  /**
   * Authenticate user with email and password
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} User and token
   */
  async login(email, password) {
    const user = await userService.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    return {
      user: userWithoutPassword,
      token,
    };
  },

  /**
   * Register a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user and token
   */
  async register(userData) {
    const { email, password, ...rest } = userData;
    
    // Check if user already exists
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await userService.create({
      ...rest,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });

    return {
      user,
      token,
    };
  },

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Decoded token
   */
  async verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  },
};

module.exports = authService;

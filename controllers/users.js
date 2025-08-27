const userService = require('../lib/services/userService');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.findAll();
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, name, password, role = 'USER' } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    const user = await userService.create({ email, name, password, role });
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

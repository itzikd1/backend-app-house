const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { jwtSecret, jwtExpiration, saltRounds } = require('../config/auth.config');

const prisma = new PrismaClient();

exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ message: 'Email is already in use!' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    // Generate token
    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: jwtExpiration,
    });

    res.status(201).send({
      id: user.id,
      email: user.email,
      name: user.name,
      accessToken: token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).send({ message: 'Error creating user' });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    // Check password
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: 'Invalid credentials!',
      });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: jwtExpiration,
    });

    res.status(200).send({
      id: user.id,
      email: user.email,
      name: user.name,
      accessToken: token,
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).send({ message: 'Error signing in' });
  }
};

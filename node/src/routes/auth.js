const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Cadastro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, location, roles, avatar } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    const user = await User.create({
      name: name || 'Usuário',
      email,
      password,
      location: location || '',
      roles: roles || ['doador'],
      avatar: avatar || '👤'
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: user.toJSON(),
      access_token: token
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'dev-secret-key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return res.json({
      message: 'Login realizado com sucesso',
      user: user.toJSON(),
      access_token: token
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Obter usuário autenticado
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    return res.json(user.toJSON());
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Verificar token
router.get('/verify-token', auth, (req, res) => {
  return res.json({ valid: true, userId: req.userId });
});

module.exports = router;

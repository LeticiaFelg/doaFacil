const express = require('express');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Item = require('../models/Item');
const Reservation = require('../models/Reservation');
const auth = require('../middleware/auth');
const {
  createPasswordResetToken,
  findValidPasswordReset,
  markPasswordResetAsUsed,
  sendPasswordResetEmail
} = require('../services/passwordResetService');

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET || 'dev-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  const digits = normalizeDigits(phone);
  return digits.length === 10 || digits.length === 11;
}

function isValidCpf(cpf) {
  return normalizeDigits(cpf).length === 11;
}

function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 6;
}

function sendPasswordResetEmailInBackground(user, resetToken) {
  sendPasswordResetEmail(user, resetToken).catch((error) => {
    console.error('[forgot-password] Falha ao enviar e-mail de redefinicao:', error.message);
  });
}

async function buildUserProfile(userId) {
  const user = await User.findByPk(userId);

  if (!user) {
    return null;
  }

  const donated_count = await Item.count({ where: { donor_id: userId } });
  const donations_completed = await Reservation.count({
    where: { donor_id: userId, status: 'concluida' }
  });
  const received_count = await Reservation.count({
    where: { user_id: userId, status: 'concluida' }
  });

  const userData = user.toJSON();
  userData.stats = {
    donated: donated_count,
    donations_completed,
    received: received_count,
    is_recurrent: donated_count >= 3
  };

  return userData;
}

// Criar conta pelo contrato esperado pelo frontend.
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      cpf,
      bairro,
      location,
      address,
      roles,
      profileType,
      avatar
    } = req.body;

    const normalizedEmail = normalizeEmail(email);
    const normalizedPhone = normalizeDigits(phone);
    const normalizedCpf = normalizeDigits(cpf);
    const userLocation = bairro || location || address || '';

    if (!name || name.trim().length < 3) {
      return res.status(400).json({ error: 'Nome completo e obrigatorio' });
    }

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'Email invalido' });
    }

    if (!normalizedPhone || !isValidPhone(normalizedPhone)) {
      return res.status(400).json({ error: 'Telefone invalido' });
    }

    if (!normalizedCpf || !isValidCpf(normalizedCpf)) {
      return res.status(400).json({ error: 'CPF invalido' });
    }

    if (!userLocation) {
      return res.status(400).json({ error: 'Bairro obrigatorio' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: normalizedEmail },
          { cpf: normalizedCpf }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email ou CPF ja cadastrado' });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      phone: normalizedPhone,
      cpf: normalizedCpf,
      bairro: userLocation,
      location: userLocation,
      roles: roles || (profileType ? [profileType] : ['doador']),
      avatar: avatar || '👤'
    });

    const token = createToken(user);

    return res.status(201).json({
      message: 'Usuario criado com sucesso',
      user: user.toJSON(),
      token,
      access_token: token
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Login pelo contrato esperado pelo frontend.
router.post('/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha sao obrigatorios' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const token = createToken(user);

    return res.json({
      message: 'Login realizado com sucesso',
      user: user.toJSON(),
      token,
      access_token: token
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Solicitar redefinicao de senha. A resposta e neutra para proteger e-mails cadastrados.
router.post('/forgot-password', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const responseMessage = 'Se o e-mail estiver cadastrado, enviaremos instrucoes para redefinir sua senha.';

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Email invalido' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.json({ message: responseMessage });
    }

    const resetToken = await createPasswordResetToken(user.id);
    sendPasswordResetEmailInBackground(user, resetToken);

    return res.json({ message: responseMessage });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Redefinir senha usando o token temporario enviado por e-mail.
router.put('/reset-password', async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token obrigatorio' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'Senha deve ter pelo menos 6 caracteres' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Confirmacao de senha nao confere' });
    }

    const passwordReset = await findValidPasswordReset(token);

    if (!passwordReset) {
      return res.status(400).json({ error: 'Token invalido ou expirado' });
    }

    const user = await User.findByPk(passwordReset.user_id);

    if (!user) {
      await markPasswordResetAsUsed(passwordReset);
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await markPasswordResetAsUsed(passwordReset);

    return res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Logout em JWT e feito no cliente removendo o token salvo.
router.post('/logout', auth, (req, res) => {
  return res.json({ message: 'Logout realizado com sucesso' });
});

// Perfil do usuario autenticado. Deve alimentar a pagina perfil.html.
router.get('/me', auth, async (req, res) => {
  try {
    const userData = await buildUserProfile(req.userId);

    if (!userData) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    return res.json(userData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Atualizar meu perfil pelo contrato esperado pelo frontend.
router.put('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    const { name, bio, location, address, bairro, phone, avatar, roles, profileType } = req.body;
    const nextLocation = bairro || location || address;

    if (name) user.name = name.trim();
    if (bio !== undefined) user.bio = bio;
    if (nextLocation) {
      user.bairro = nextLocation;
      user.location = nextLocation;
    }
    if (phone) user.phone = normalizeDigits(phone);
    if (avatar) user.avatar = avatar;
    if (roles || profileType) user.roles = roles || [profileType];

    await user.save();

    return res.json({
      message: 'Perfil atualizado com sucesso',
      user: user.toJSON()
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Excluir conta e limpar dados diretamente associados ao usuario.
router.delete('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    await Reservation.destroy({
      where: {
        [Op.or]: [
          { user_id: req.userId },
          { donor_id: req.userId }
        ]
      }
    });

    await Item.destroy({ where: { donor_id: req.userId } });
    await user.destroy();

    return res.json({ message: 'Conta removida com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Alias mantido para compatibilidade com rotas antigas.
router.get('/me/profile', auth, async (req, res) => {
  try {
    const userData = await buildUserProfile(req.userId);

    if (!userData) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    return res.json(userData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Minhas doacoes.
router.get('/me/donations', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;

    const { count, rows } = await Item.findAndCountAll({
      where: { donor_id: req.userId },
      limit: per_page,
      offset: (page - 1) * per_page
    });

    return res.json({
      donations: rows,
      total: count,
      pages: Math.ceil(count / per_page),
      current_page: page
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Buscar usuarios.
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';

    if (q.length < 2) {
      return res.status(400).json({ error: 'Busca deve ter pelo menos 2 caracteres' });
    }

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { email: { [Op.like]: `%${q}%` } }
        ]
      },
      limit: 20,
      attributes: { exclude: ['password'] }
    });

    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Perfil publico de um usuario.
router.get('/:id', async (req, res) => {
  try {
    const userData = await buildUserProfile(req.params.id);

    if (!userData) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    return res.json(userData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Estatisticas publicas de usuario.
router.get('/:id/statistics', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    const donated = await Item.count({ where: { donor_id: req.params.id } });
    const received = await Reservation.count({
      where: { user_id: req.params.id, status: 'concluida' }
    });
    const active_items = await Item.count({
      where: { donor_id: req.params.id, status: 'disponivel' }
    });

    return res.json({
      user_id: req.params.id,
      donated,
      received,
      active_items,
      is_recurrent: donated >= 3,
      member_since: user.createdAt
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;

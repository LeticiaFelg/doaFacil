const express = require('express');
const { Op } = require('sequelize');
const User = require('../models/User');
const Item = require('../models/Item');
const Reservation = require('../models/Reservation');
const auth = require('../middleware/auth');

const router = express.Router();

// Obter perfil de um usuário
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const donated_count = await Item.count({ where: { donor_id: req.params.id } });
    const donations_completed = await Reservation.count({
      where: { donor_id: req.params.id, status: 'concluida' }
    });
    const received_count = await Reservation.count({
      where: { user_id: req.params.id, status: 'concluida' }
    });

    const userData = user.toJSON();
    userData.stats = {
      donated: donated_count,
      donations_completed,
      received: received_count,
      is_recurrent: donated_count >= 3
    };

    return res.json(userData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Obter meu perfil
router.get('/me/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const donated_count = await Item.count({ where: { donor_id: req.userId } });
    const received_count = await Reservation.count({
      where: { user_id: req.userId, status: 'concluida' }
    });

    const userData = user.toJSON();
    userData.stats = {
      donated: donated_count,
      received: received_count,
      is_recurrent: donated_count >= 3
    };

    return res.json(userData);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Atualizar meu perfil
router.put('/me/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { name, bio, location, avatar, roles } = req.body;

    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (location) user.location = location;
    if (avatar) user.avatar = avatar;
    if (roles) user.roles = roles;

    await user.save();

    return res.json({
      message: 'Perfil atualizado com sucesso',
      user: user.toJSON()
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Minhas doações
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

// Buscar usuários
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

// Estatísticas de usuário
router.get('/:id/statistics', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
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

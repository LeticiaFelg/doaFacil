const express = require('express');
const { Op } = require('sequelize');
const User = require('../models/User');
const Item = require('../models/Item');
const History = require('../models/History');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuario nao encontrado' });
    return res.json({ user: user.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/me/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuario nao encontrado' });

    const allowed = ['name', 'location', 'avatar', 'bio', 'roles'];
    const updates = {};
    allowed.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) updates[field] = req.body[field];
    });

    await user.update(updates);
    return res.json({ message: 'Perfil atualizado com sucesso', user: user.toJSON() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/me/donations', auth, async (req, res) => {
  try {
    const donations = await Item.findAll({
      where: { donor_id: req.userId },
      order: [['createdAt', 'DESC']]
    });

    return res.json({ donations });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const users = await User.findAll({
      where: q ? {
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { location: { [Op.iLike]: `%${q}%` } }
        ]
      } : {},
      attributes: ['id', 'name', 'location', 'avatar', 'verified', 'roles'],
      limit: 20,
      order: [['name', 'ASC']]
    });

    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id/statistics', async (req, res) => {
  try {
    const userId = req.params.id;
    const total_donations = await Item.count({ where: { donor_id: userId } });
    const completed_donations = await History.count({
      where: { donor_id: userId, transaction_type: 'doacao', status: 'concluida' }
    });

    return res.json({
      user_id: Number(userId),
      total_donations,
      completed_donations
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'location', 'avatar', 'bio', 'verified', 'roles', 'createdAt']
    });

    if (!user) return res.status(404).json({ error: 'Usuario nao encontrado' });
    return res.json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;

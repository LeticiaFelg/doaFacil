const express = require('express');
const { Op } = require('sequelize');
const Item = require('../models/Item');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

function pagination(query) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const perPage = Math.min(Math.max(parseInt(query.per_page, 10) || 12, 1), 50);
  return { page, perPage, offset: (page - 1) * perPage };
}

router.get('/', async (req, res) => {
  try {
    const { page, perPage, offset } = pagination(req.query);
    const { category, status, search, location } = req.query;
    const where = {};

    if (category) where.category = category;
    if (status) where.status = status;
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Item.findAndCountAll({
      where,
      include: [{ model: User, as: 'donor', attributes: ['id', 'name', 'location', 'avatar', 'verified'] }],
      order: [['createdAt', 'DESC']],
      limit: perPage,
      offset
    });

    return res.json({
      items: rows,
      total: count,
      pages: Math.ceil(count / perPage),
      current_page: page
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const { page, perPage, offset } = pagination(req.query);
    const { count, rows } = await Item.findAndCountAll({
      where: { category: req.params.category },
      include: [{ model: User, as: 'donor', attributes: ['id', 'name', 'location', 'avatar', 'verified'] }],
      order: [['createdAt', 'DESC']],
      limit: perPage,
      offset
    });

    return res.json({
      items: rows,
      total: count,
      pages: Math.ceil(count / perPage),
      current_page: page
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [{ model: User, as: 'donor', attributes: ['id', 'name', 'location', 'avatar', 'verified'] }]
    });

    if (!item) {
      return res.status(404).json({ error: 'Item nao encontrado' });
    }

    return res.json({ item });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const item = await Item.create({
      ...req.body,
      donor_id: req.userId
    });

    return res.status(201).json({ message: 'Item criado com sucesso', item });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item nao encontrado' });
    }
    if (item.donor_id !== req.userId) {
      return res.status(403).json({ error: 'Voce nao pode editar este item' });
    }

    await item.update(req.body);
    return res.json({ message: 'Item atualizado com sucesso', item });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item nao encontrado' });
    }
    if (item.donor_id !== req.userId) {
      return res.status(403).json({ error: 'Voce nao pode excluir este item' });
    }

    await item.destroy();
    return res.json({ message: 'Item excluido com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;

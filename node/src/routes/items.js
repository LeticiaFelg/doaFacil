const express = require('express');
const { Op } = require('sequelize');
const Item = require('../models/Item');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Listar itens com filtros
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 12;
    const category = req.query.category;
    const status = req.query.status || 'disponivel';
    const search = req.query.search || '';

    let where = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Item.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'donor',
        attributes: ['id', 'name', 'avatar', 'verified', 'location']
      }],
      limit: per_page,
      offset: (page - 1) * per_page
    });

    return res.json({
      items: rows,
      total: count,
      pages: Math.ceil(count / per_page),
      current_page: page
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Obter item por ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'donor',
        attributes: ['id', 'name', 'avatar', 'verified', 'location']
      }]
    });

    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    return res.json(item);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Criar item
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, category, emoji, condition, location, images } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Título e descrição são obrigatórios' });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const item = await Item.create({
      title,
      description,
      category: category || 'outros',
      emoji: emoji || '📦',
      condition: condition || 'bom',
      location: location || user.location,
      images: images || [],
      donor_id: req.userId,
      status: 'disponivel'
    });

    return res.status(201).json({
      message: 'Item criado com sucesso',
      item
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Atualizar item
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    if (item.donor_id !== req.userId) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    const { title, description, condition, status, images } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (condition) item.condition = condition;
    if (status) item.status = status;
    if (images) item.images = images;

    await item.save();

    return res.json({
      message: 'Item atualizado com sucesso',
      item
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Deletar item
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item não encontrado' });
    }

    if (item.donor_id !== req.userId) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    await item.destroy();

    return res.json({ message: 'Item deletado com sucesso' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Itens por categoria
router.get('/category/:category', async (req, res) => {
  try {
    const items = await Item.findAll({
      where: {
        category: req.params.category,
        status: 'disponivel'
      },
      include: [{
        model: User,
        as: 'donor',
        attributes: ['id', 'name', 'avatar', 'verified']
      }]
    });

    return res.json({
      category: req.params.category,
      items
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;

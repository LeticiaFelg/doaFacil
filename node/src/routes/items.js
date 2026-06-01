const express = require('express');
const { Op } = require('sequelize');
const Item = require('../models/Item');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const donorAttributes = ['id', 'name', 'avatar', 'verified', 'location'];

function onlyDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function toWhatsAppInternationalNumber(phone) {
  const digits = onlyDigits(phone);

  if (!digits) return '';
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) return digits;
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;

  return digits;
}

function buildWhatsAppUrl(phone, itemTitle) {
  const whatsappNumber = toWhatsAppInternationalNumber(phone);

  if (!whatsappNumber) {
    return '';
  }

  const message = encodeURIComponent(
    `Ola! Vi o item "${itemTitle}" no DoaFacil e gostaria de combinar a retirada.`
  );

  return `https://wa.me/${whatsappNumber}?text=${message}`;
}

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
        attributes: donorAttributes
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

// Meus itens pelo contrato esperado pelo frontend: /api/items/my
router.get('/my', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 12;

    const { count, rows } = await Item.findAndCountAll({
      where: { donor_id: req.userId },
      include: [{
        model: User,
        as: 'donor',
        attributes: donorAttributes
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

// Gerar link de contato via WhatsApp sem expor telefone nas consultas de item.
router.post('/:id/contact/whatsapp', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'donor',
        attributes: ['id', 'name', 'phone']
      }]
    });

    if (!item) {
      return res.status(404).json({ error: 'Item nao encontrado' });
    }

    if (!item.donor?.phone) {
      return res.status(404).json({ error: 'Telefone do doador nao disponivel' });
    }

    const whatsappUrl = buildWhatsAppUrl(item.donor.phone, item.title);

    if (!whatsappUrl) {
      return res.status(400).json({ error: 'Telefone do doador invalido' });
    }

    return res.json({
      url: whatsappUrl
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
        attributes: donorAttributes
      }]
    });

    if (!item) {
      return res.status(404).json({ error: 'Item nao encontrado' });
    }

    return res.json(item);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Criar item
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      emoji,
      condition,
      location,
      images,
      dimensions,
      material,
      color,
      pickup,
      address
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Titulo e descricao sao obrigatorios' });
    }

    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    const item = await Item.create({
      title,
      description,
      category: category || 'outros',
      emoji: emoji || '📦',
      condition: condition || 'bom',
      location: location || user.location,
      images: images || [],
      dimensions: dimensions || '',
      material: material || '',
      color: color || '',
      pickup: pickup || '',
      address: address || {},
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
      return res.status(404).json({ error: 'Item nao encontrado' });
    }

    if (item.donor_id !== req.userId) {
      return res.status(403).json({ error: 'Sem permissao' });
    }

    const { title, description, condition, status, images, dimensions, material, color, pickup, address } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (condition) item.condition = condition;
    if (status) item.status = status;
    if (images) item.images = images;
    if (dimensions !== undefined) item.dimensions = dimensions;
    if (material !== undefined) item.material = material;
    if (color !== undefined) item.color = color;
    if (pickup !== undefined) item.pickup = pickup;
    if (address !== undefined) item.address = address;

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
      return res.status(404).json({ error: 'Item nao encontrado' });
    }

    if (item.donor_id !== req.userId) {
      return res.status(403).json({ error: 'Sem permissao' });
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
        attributes: donorAttributes
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

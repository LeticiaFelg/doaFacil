const express = require('express');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Item = require('../models/Item');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const donorAttributes = ['id', 'name', 'avatar', 'verified', 'location'];
const ITEM_DESCRIPTION_MAX_LENGTH = 1000;
const MAX_ITEM_IMAGES = 3;
const uploadDir = path.join(__dirname, '../../uploads/items');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeBaseName = path.basename(file.originalname, extension)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'item';

    cb(null, `${Date.now()}-${safeBaseName}${extension}`);
  }
});

const upload = multer({
  storage,
  limits: {
    files: MAX_ITEM_IMAGES,
    fileSize: 5 * 1024 * 1024
  },
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Apenas imagens podem ser enviadas'));
    }

    return cb(null, true);
  }
});

function getUploadedImageUrls(files) {
  return (files || []).map((file) => `/uploads/items/${file.filename}`);
}

/*
// Implementacao futura para S3 com presigned URL.
// Requer instalar/configurar AWS SDK:
// npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
//
// const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
//
// const s3 = new S3Client({
//   region: process.env.AWS_REGION
// });
//
// async function createItemImageUploadUrl({ userId, fileName, contentType }) {
//   const extension = path.extname(fileName).toLowerCase();
//   const safeBaseName = path.basename(fileName, extension)
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '-')
//     .replace(/^-|-$/g, '')
//     .slice(0, 60) || 'item';
//   const key = `items/${userId}/${Date.now()}-${safeBaseName}${extension}`;
//
//   const command = new PutObjectCommand({
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: key,
//     ContentType: contentType
//   });
//
//   const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
//   const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
//
//   return { key, uploadUrl, publicUrl };
// }
*/

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

    if (status && status !== 'all') {
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
router.post('/', auth, upload.array('images', MAX_ITEM_IMAGES), async (req, res) => {
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
    const uploadedImages = getUploadedImageUrls(req.files);
    const parsedImages = Array.isArray(images)
      ? images
      : typeof images === 'string' && images
        ? [images]
        : [];
    const parsedAddress = typeof address === 'string'
      ? JSON.parse(address || '{}')
      : address;

    if (!title || !description) {
      return res.status(400).json({ error: 'Titulo e descricao sao obrigatorios' });
    }

    if (description.length > ITEM_DESCRIPTION_MAX_LENGTH) {
      return res.status(400).json({ error: `Descricao deve ter no maximo ${ITEM_DESCRIPTION_MAX_LENGTH} caracteres` });
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
      images: uploadedImages.length ? uploadedImages : parsedImages,
      dimensions: dimensions || '',
      material: material || '',
      color: color || '',
      pickup: pickup || '',
      address: parsedAddress || {},
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
router.put('/:id', auth, upload.array('images', MAX_ITEM_IMAGES), async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item nao encontrado' });
    }

    if (item.donor_id !== req.userId) {
      return res.status(403).json({ error: 'Sem permissao' });
    }

    const {
      title,
      description,
      category,
      emoji,
      condition,
      status,
      location,
      images,
      dimensions,
      material,
      color,
      pickup,
      address
    } = req.body;
    const uploadedImages = getUploadedImageUrls(req.files);
    const parsedImages = Array.isArray(images)
      ? images
      : typeof images === 'string' && images
        ? [images]
        : [];
    const parsedAddress = typeof address === 'string'
      ? JSON.parse(address || '{}')
      : address;

    if (title) item.title = title;
    if (category) item.category = category;
    if (emoji) item.emoji = emoji;
    if (description) {
      if (description.length > ITEM_DESCRIPTION_MAX_LENGTH) {
        return res.status(400).json({ error: `Descricao deve ter no maximo ${ITEM_DESCRIPTION_MAX_LENGTH} caracteres` });
      }
      item.description = description;
    }
    if (condition) item.condition = condition;
    if (status) item.status = status;
    if (location) item.location = location;
    if (uploadedImages.length || parsedImages.length) {
      item.images = uploadedImages.length ? uploadedImages : parsedImages;
    }
    if (dimensions !== undefined) item.dimensions = dimensions;
    if (material !== undefined) item.material = material;
    if (color !== undefined) item.color = color;
    if (pickup !== undefined) item.pickup = pickup;
    if (parsedAddress !== undefined) item.address = parsedAddress;

    await item.save();

    return res.json({
      message: 'Item atualizado com sucesso',
      item
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Cancelar item (soft delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Item nao encontrado' });
    }

    if (item.donor_id !== req.userId) {
      return res.status(403).json({ error: 'Sem permissao' });
    }

    item.status = 'cancelado';
    await item.save();

    return res.json({
      message: 'Item cancelado com sucesso',
      item
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// src/routes/items.js

const express        = require('express');
const ItemModel      = require('../models/Item');
const authMiddleware = require('../middleware/auth');
const upload         = require('../middleware/upload');

const router = express.Router();

// ─── GET /api/items ───────────────────────────────────────
// Lista itens públicos. Filtros: ?category=&status=&search=
router.get('/', (req, res) => {
  try {
    const { category, status, search } = req.query;
    const items = ItemModel.list({ category, status, search });
    return res.json({ items, total: items.length });
  } catch (err) {
    console.error('[GET /items]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── GET /api/items/my ────────────────────────────────────
router.get('/my', authMiddleware, (req, res) => {
  try {
    const items = ItemModel.listByDonor(req.user.userId);
    return res.json({ items, total: items.length });
  } catch (err) {
    console.error('[GET /items/my]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── GET /api/items/:id ───────────────────────────────────
router.get('/:id', (req, res) => {
  try {
    const item = ItemModel.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item não encontrado.' });
    return res.json({ item });
  } catch (err) {
    console.error('[GET /items/:id]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── POST /api/items ──────────────────────────────────────
// Cria um item. Aceita imageUrl como campo de texto opcional.
// Para enviar imagem por arquivo, use POST /api/items/:id/image depois.
router.post('/', authMiddleware, (req, res) => {
  try {
    const { title, description, category, condition, location, imageUrl } = req.body;

    if (!title || !category || !condition) {
      return res.status(400).json({ error: 'Título, categoria e condição são obrigatórios.' });
    }

    const item = ItemModel.create({
      donorId: req.user.userId,
      title,
      description,
      category,
      condition,
      location,
      imageUrl: imageUrl || null,
    });

    return res.status(201).json({ item });
  } catch (err) {
    if (err.message.startsWith('Categoria') || err.message.startsWith('Condição')) {
      return res.status(400).json({ error: err.message });
    }
    console.error('[POST /items]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── POST /api/items/:id/image ────────────────────────────
// Opção A: upload de arquivo (multipart/form-data, campo "image")
// Opção B: URL externa (JSON com campo "imageUrl")
//
// Exemplos de uso com jQuery:
//
// Opção A — arquivo:
//   const formData = new FormData();
//   formData.append('image', $('#input-file')[0].files[0]);
//   $.ajax({ url: `/api/items/${id}/image`, method: 'POST',
//            data: formData, processData: false, contentType: false,
//            headers: { Authorization: `Bearer ${token}` } });
//
// Opção B — URL:
//   $.ajax({ url: `/api/items/${id}/image`, method: 'POST',
//            contentType: 'application/json',
//            data: JSON.stringify({ imageUrl: 'https://...' }),
//            headers: { Authorization: `Bearer ${token}` } });

router.post('/:id/image', authMiddleware, (req, res, next) => {
  // Detecta se é upload de arquivo ou URL pela Content-Type
  const isMultipart = (req.headers['content-type'] || '').includes('multipart/form-data');

  if (isMultipart) {
    // Opção A: upload de arquivo
    upload.single('image')(req, res, (err) => {
      if (err) {
        const msg = err.code === 'LIMIT_FILE_SIZE'
          ? 'Arquivo muito grande. Máximo: 5 MB.'
          : err.message;
        return res.status(400).json({ error: msg });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
      }

      // Monta a URL pública do arquivo salvo
      const publicUrl = `${process.env.PUBLIC_URL || 'http://localhost:3000'}/uploads/${req.file.filename}`;

      try {
        const item = ItemModel.updateImage(req.params.id, req.user.userId, publicUrl);
        return res.json({ item, imageUrl: publicUrl });
      } catch (updateErr) {
        if (updateErr.code === 'NOT_FOUND') {
          return res.status(403).json({ error: 'Item não encontrado ou sem permissão.' });
        }
        console.error('[POST /items/:id/image — upload]', updateErr);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
      }
    });
  } else {
    // Opção B: URL externa
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl é obrigatório.' });
    }

    // Validação básica de URL
    try {
      new URL(imageUrl);
    } catch {
      return res.status(400).json({ error: 'URL de imagem inválida.' });
    }

    try {
      const item = ItemModel.updateImage(req.params.id, req.user.userId, imageUrl);
      return res.json({ item, imageUrl });
    } catch (err) {
      if (err.code === 'NOT_FOUND') {
        return res.status(403).json({ error: 'Item não encontrado ou sem permissão.' });
      }
      console.error('[POST /items/:id/image — url]', err);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
});

// ─── PUT /api/items/:id ───────────────────────────────────
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const item = ItemModel.update(req.params.id, req.user.userId, req.body);
    return res.json({ item });
  } catch (err) {
    if (err.code === 'NOT_FOUND')                        return res.status(403).json({ error: 'Item não encontrado ou sem permissão.' });
    if (err.message === 'Nenhum campo válido para atualizar.') return res.status(400).json({ error: err.message });
    console.error('[PUT /items/:id]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── DELETE /api/items/:id ────────────────────────────────
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    ItemModel.delete(req.params.id, req.user.userId);
    return res.json({ message: 'Item removido com sucesso.' });
  } catch (err) {
    if (err.code === 'NOT_FOUND') return res.status(403).json({ error: 'Item não encontrado ou sem permissão.' });
    console.error('[DELETE /items/:id]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
const express = require('express');
const History = require('../models/History');
const auth = require('../middleware/auth');

const router = express.Router();

// Histórico de doações
router.get('/my/donations', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;
    const status = req.query.status;

    let where = { donor_id: req.userId, transaction_type: 'doacao' };
    if (status) where.status = status;

    const { count, rows } = await History.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
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

// Itens recebidos
router.get('/my/received', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;
    const status = req.query.status;

    let where = { receiver_id: req.userId, transaction_type: 'recepcao' };
    if (status) where.status = status;

    const { count, rows } = await History.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: per_page,
      offset: (page - 1) * per_page
    });

    return res.json({
      received: rows,
      total: count,
      pages: Math.ceil(count / per_page),
      current_page: page
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Minhas estatísticas
router.get('/my/statistics', auth, async (req, res) => {
  try {
    const total_donations = await History.count({
      where: { donor_id: req.userId, transaction_type: 'doacao' }
    });

    const completed_donations = await History.count({
      where: { donor_id: req.userId, transaction_type: 'doacao', status: 'concluida' }
    });

    const total_received = await History.count({
      where: { receiver_id: req.userId, transaction_type: 'recepcao' }
    });

    return res.json({
      donations: {
        total: total_donations,
        completed: completed_donations
      },
      received: {
        total: total_received
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Histórico de um usuário
router.get('/user/:user_id/donations', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const per_page = parseInt(req.query.per_page) || 10;

    const { count, rows } = await History.findAndCountAll({
      where: {
        donor_id: req.params.user_id,
        transaction_type: 'doacao',
        status: 'concluida'
      },
      order: [['createdAt', 'DESC']],
      limit: per_page,
      offset: (page - 1) * per_page
    });

    return res.json({
      user_id: req.params.user_id,
      donations: rows,
      total: count,
      pages: Math.ceil(count / per_page),
      current_page: page
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Estatísticas globais
router.get('/statistics', async (req, res) => {
  try {
    const total_items_donated = await History.count({
      where: { transaction_type: 'doacao', status: 'concluida' }
    });

    const total_families_helped = await History.count({
      distinct: true,
      col: 'receiver_id',
      where: { transaction_type: 'recepcao', status: 'concluida' }
    });

    const active_donors = await History.count({
      distinct: true,
      col: 'donor_id',
      where: { transaction_type: 'doacao' }
    });

    return res.json({
      items_donated: total_items_donated,
      families_helped: total_families_helped,
      active_donors
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;

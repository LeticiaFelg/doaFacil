const express = require('express');
const History = require('../models/History');
const User = require('../models/User');
const Item = require('../models/Item');
const Reservation = require('../models/Reservation');
const auth = require('../middleware/auth');

const router = express.Router();

function getFirstImage(item) {
  if (!item || !Array.isArray(item.images) || item.images.length === 0) {
    return null;
  }

  return item.images[0];
}

function mapStatus(status) {
  const statuses = {
    disponivel: 'disponivel',
    reservado: 'reservado',
    concluido: 'concluido',
    concluida: 'concluido',
    pendente: 'reservado',
    confirmada: 'reservado',
    cancelada: 'cancelado'
  };

  return statuses[status] || status || 'disponivel';
}

// Historico completo do usuario autenticado para a tela historico.html.
// A tela carrega tudo uma vez e aplica filtros no frontend.
router.get('/my', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuario nao encontrado' });
    }

    const donatedItems = await Item.findAll({
      where: { donor_id: req.userId },
      order: [['createdAt', 'DESC']]
    });

    const donatedReservations = await Reservation.findAll({
      where: { donor_id: req.userId },
      include: [
        { model: User, as: 'receiver', attributes: ['id', 'name', 'avatar', 'verified', 'location'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const latestReservationByItem = donatedReservations.reduce((acc, reservation) => {
      if (!acc.has(reservation.item_id)) {
        acc.set(reservation.item_id, reservation);
      }
      return acc;
    }, new Map());

    const donated = donatedItems.map((item) => {
      const reservation = latestReservationByItem.get(item.id);

      return {
        id: item.id,
        item_id: item.id,
        reservation_id: reservation?.id || null,
        image: getFirstImage(item),
        name: item.title,
        cat: item.category,
        receptor: reservation?.receiver?.name || 'Ainda sem receptor',
        date: reservation?.createdAt || item.createdAt,
        status: mapStatus(reservation?.status || item.status)
      };
    });

    const receivedReservations = await Reservation.findAll({
      where: { user_id: req.userId },
      include: [
        { model: Item, as: 'item' },
        { model: User, as: 'donor', attributes: ['id', 'name', 'avatar', 'verified', 'location'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const received = receivedReservations.map((reservation) => ({
      id: reservation.id,
      reservation_id: reservation.id,
      item_id: reservation.item_id,
      image: getFirstImage(reservation.item),
      name: reservation.item?.title || 'Item removido',
      cat: reservation.item?.category || '',
      doador: reservation.donor?.name || 'Doador nao encontrado',
      date: reservation.createdAt,
      status: mapStatus(reservation.status)
    }));

    const allRows = [...donated, ...received];
    const completed = allRows.filter((item) => item.status === 'concluido').length;
    const inProgress = allRows.filter((item) => ['disponivel', 'reservado'].includes(item.status)).length;

    return res.json({
      user: user.toJSON(),
      summary: {
        donated: donated.length,
        received: received.length,
        completed,
        in_progress: inProgress,
        is_recurrent: donated.length >= 3
      },
      donated,
      received
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

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

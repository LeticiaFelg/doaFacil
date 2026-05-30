const express = require('express');
const Reservation = require('../models/Reservation');
const Item = require('../models/Item');
const History = require('../models/History');
const auth = require('../middleware/auth');

const router = express.Router();

// Minhas reservas pendentes
router.get('/my/pending', auth, async (req, res) => {
  try {
    const made = await Reservation.findAll({
      where: { user_id: req.userId, status: 'pendente' }
    });

    const received = await Reservation.findAll({
      where: { donor_id: req.userId, status: 'pendente' }
    });

    return res.json({
      reservations_made: made,
      reservations_received: received
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Reservas de um item
router.get('/item/:item_id', async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.item_id);

    if (!item) {
      return res.status(404).json({ error: 'Item nao encontrado' });
    }

    const reservations = await Reservation.findAll({
      where: { item_id: req.params.item_id }
    });

    return res.json({ item, reservations });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Criar reserva
router.post('/', auth, async (req, res) => {
  try {
    const { item_id, message } = req.body;

    if (!item_id) {
      return res.status(400).json({ error: 'Item ID e obrigatorio' });
    }

    const item = await Item.findByPk(item_id);
    if (!item) {
      return res.status(404).json({ error: 'Item nao encontrado' });
    }

    const existing = await Reservation.findOne({
      where: { item_id, status: 'confirmada' }
    });
    if (existing) {
      return res.status(409).json({ error: 'Item ja foi reservado' });
    }

    const userRes = await Reservation.findOne({
      where: { item_id, user_id: req.userId }
    });
    if (userRes) {
      return res.status(409).json({ error: 'Voce ja reservou este item' });
    }

    const reservation = await Reservation.create({
      item_id,
      user_id: req.userId,
      donor_id: item.donor_id,
      message: message || '',
      status: 'pendente'
    });

    return res.status(201).json({
      message: 'Reserva criada com sucesso',
      reservation
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Obter reserva
router.get('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva nao encontrada' });
    }

    return res.json(reservation);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Confirmar reserva (doador)
router.put('/:id/confirm', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva nao encontrada' });
    }

    if (reservation.donor_id !== req.userId) {
      return res.status(403).json({ error: 'Sem permissao' });
    }

    if (reservation.status !== 'pendente') {
      return res.status(409).json({ error: `Reserva ja esta ${reservation.status}` });
    }

    reservation.status = 'confirmada';
    await reservation.save();

    const item = await Item.findByPk(reservation.item_id);
    item.status = 'reservado';
    await item.save();

    return res.json({
      message: 'Reserva confirmada com sucesso',
      reservation
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Completar reserva
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva nao encontrada' });
    }

    if (reservation.donor_id !== req.userId && reservation.user_id !== req.userId) {
      return res.status(403).json({ error: 'Sem permissao' });
    }

    if (reservation.status !== 'confirmada') {
      return res.status(409).json({ error: 'Apenas reservas confirmadas podem ser completadas' });
    }

    reservation.status = 'concluida';
    reservation.completed_at = new Date().toISOString();
    await reservation.save();

    const item = await Item.findByPk(reservation.item_id);
    item.status = 'concluido';
    await item.save();

    await History.create({
      item_id: reservation.item_id,
      donor_id: reservation.donor_id,
      receiver_id: reservation.user_id,
      transaction_type: 'doacao',
      status: 'concluida'
    });

    return res.json({
      message: 'Entrega concluida com sucesso',
      reservation
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Cancelar reserva
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva nao encontrada' });
    }

    if (reservation.donor_id !== req.userId && reservation.user_id !== req.userId) {
      return res.status(403).json({ error: 'Sem permissao' });
    }

    if (['concluida', 'cancelada'].includes(reservation.status)) {
      return res.status(409).json({ error: `Reserva ja esta ${reservation.status}` });
    }

    reservation.status = 'cancelada';
    await reservation.save();

    const item = await Item.findByPk(reservation.item_id);
    if (item.status === 'reservado') {
      item.status = 'disponivel';
      await item.save();
    }

    return res.json({
      message: 'Reserva cancelada com sucesso',
      reservation
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;

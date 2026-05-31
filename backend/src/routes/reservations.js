const express = require('express');
const Reservation = require('../models/Reservation');
const Item = require('../models/Item');
const User = require('../models/User');
const History = require('../models/History');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/my/pending', auth, async (req, res) => {
  try {
    const reservations_made = await Reservation.findAll({
      where: { user_id: req.userId },
      order: [['createdAt', 'DESC']]
    });

    const reservations_received = await Reservation.findAll({
      where: { donor_id: req.userId },
      order: [['createdAt', 'DESC']]
    });

    return res.json({ reservations_made, reservations_received });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/item/:item_id', auth, async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.item_id);
    if (!item) return res.status(404).json({ error: 'Item nao encontrado' });
    if (item.donor_id !== req.userId) {
      return res.status(403).json({ error: 'Voce nao pode listar reservas deste item' });
    }

    const reservations = await Reservation.findAll({
      where: { item_id: item.id },
      include: [{ model: User, as: 'receiver', attributes: ['id', 'name', 'location', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    });

    return res.json({ reservations });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { item_id, itemId, message } = req.body;
    const normalizedItemId = item_id || itemId;
    const item = await Item.findByPk(normalizedItemId);

    if (!item) return res.status(404).json({ error: 'Item nao encontrado' });
    if (item.donor_id === req.userId) {
      return res.status(400).json({ error: 'Voce nao pode reservar seu proprio item' });
    }
    if (item.status !== 'disponivel') {
      return res.status(409).json({ error: 'Item indisponivel para reserva' });
    }

    const reservation = await Reservation.create({
      item_id: item.id,
      user_id: req.userId,
      donor_id: item.donor_id,
      message: message || '',
      status: 'pendente'
    });

    await item.update({ status: 'reservado' });

    return res.status(201).json({ message: 'Reserva criada com sucesso', reservation });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reserva nao encontrada' });
    if (![reservation.user_id, reservation.donor_id].includes(req.userId)) {
      return res.status(403).json({ error: 'Voce nao pode acessar esta reserva' });
    }

    return res.json({ reservation });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:id/confirm', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reserva nao encontrada' });
    if (reservation.donor_id !== req.userId) {
      return res.status(403).json({ error: 'Apenas o doador pode confirmar a reserva' });
    }

    await reservation.update({ status: 'confirmada' });
    return res.json({ message: 'Reserva confirmada com sucesso', reservation });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:id/complete', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reserva nao encontrada' });
    if (reservation.donor_id !== req.userId) {
      return res.status(403).json({ error: 'Apenas o doador pode concluir a reserva' });
    }

    const item = await Item.findByPk(reservation.item_id);
    await reservation.update({ status: 'concluida', completed_at: new Date() });
    if (item) await item.update({ status: 'concluido' });

    await History.create({
      item_id: reservation.item_id,
      donor_id: reservation.donor_id,
      receiver_id: reservation.user_id,
      transaction_type: 'doacao',
      status: 'concluida',
      notes: reservation.message || ''
    });

    return res.json({ message: 'Reserva concluida com sucesso', reservation });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reserva nao encontrada' });
    if (![reservation.user_id, reservation.donor_id].includes(req.userId)) {
      return res.status(403).json({ error: 'Voce nao pode cancelar esta reserva' });
    }

    const item = await Item.findByPk(reservation.item_id);
    await reservation.update({ status: 'cancelada' });
    if (item && item.status === 'reservado') await item.update({ status: 'disponivel' });

    return res.json({ message: 'Reserva cancelada com sucesso', reservation });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;

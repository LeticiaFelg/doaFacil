// src/routes/reservations.js
// Criação e gestão de reservas + histórico de recebimentos.

const express = require('express');
const ReservationModel = require('../models/Reservation');
const ItemModel = require('../models/Item');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ─── POST /api/reservations ───────────────────────────────
// Receptor reserva um item.
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ error: 'itemId é obrigatório.' });
    }

    // Busca o item para pegar o donorId e validar disponibilidade
    const item = await ItemModel.findById(itemId);
    if (!item) return res.status(404).json({ error: 'Item não encontrado.' });

    if (item.status !== 'available') {
      return res.status(409).json({ error: 'Item não está disponível para reserva.' });
    }

    if (item.donorId === req.user.userId) {
      return res.status(400).json({ error: 'Você não pode reservar o próprio item.' });
    }

    const reservation = await ReservationModel.create({
      itemId,
      receiverId: req.user.userId,
      donorId: item.donorId,
    });

    return res.status(201).json({ reservation });
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      return res.status(409).json({ error: 'Item não está disponível para reserva.' });
    }
    console.error('[POST /reservations]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── GET /api/reservations/received ──────────────────────
// Histórico de itens recebidos (pelo receptor logado).
router.get('/received', authMiddleware, async (req, res) => {
  try {
    const reservations = await ReservationModel.listByReceiver(req.user.userId);
    return res.json({ reservations, total: reservations.length });
  } catch (err) {
    console.error('[GET /reservations/received]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── GET /api/reservations/donated ───────────────────────
// Reservas dos itens que o doador logado disponibilizou.
router.get('/donated', authMiddleware, async (req, res) => {
  try {
    const reservations = await ReservationModel.listByDonor(req.user.userId);
    return res.json({ reservations, total: reservations.length });
  } catch (err) {
    console.error('[GET /reservations/donated]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── GET /api/reservations/:id ────────────────────────────
// Detalhe de uma reserva (somente doador ou receptor podem ver).
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const reservation = await ReservationModel.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reserva não encontrada.' });

    const isParticipant =
      reservation.donorId === req.user.userId ||
      reservation.receiverId === req.user.userId;

    if (!isParticipant) {
      return res.status(403).json({ error: 'Sem permissão para ver esta reserva.' });
    }

    return res.json({ reservation });
  } catch (err) {
    console.error('[GET /reservations/:id]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── PATCH /api/reservations/:id/status ──────────────────
// Atualiza status: doador confirma/completa; receptor cancela.
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'status é obrigatório.' });

    const reservation = await ReservationModel.findById(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Reserva não encontrada.' });

    const isDonor    = reservation.donorId    === req.user.userId;
    const isReceiver = reservation.receiverId === req.user.userId;

    // Regras de negócio: quem pode fazer cada transição
    const allowedTransitions = {
      donor:    ['confirmed', 'completed', 'cancelled'],
      receiver: ['cancelled'],
    };

    if (isDonor    && !allowedTransitions.donor.includes(status))    return res.status(403).json({ error: 'Transição não permitida para o doador.' });
    if (isReceiver && !allowedTransitions.receiver.includes(status)) return res.status(403).json({ error: 'Transição não permitida para o receptor.' });
    if (!isDonor && !isReceiver) return res.status(403).json({ error: 'Sem permissão.' });

    const updated = await ReservationModel.updateStatus(req.params.id, status, req.user.userId);
    return res.json({ reservation: updated });
  } catch (err) {
    if (err.message.startsWith('Status inválido')) {
      return res.status(400).json({ error: err.message });
    }
    console.error('[PATCH /reservations/:id/status]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;

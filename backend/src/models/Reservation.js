// src/models/Reservation.js

const db = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

const VALID_STATUSES = ['pending','confirmed','completed','cancelled'];

const ReservationModel = {

  create({ itemId, receiverId, donorId }) {
    const now           = new Date().toISOString();
    const reservationId = uuidv4();

    // Transação: cria a reserva e muda status do item atomicamente.
    // Se qualquer parte falhar, nada é salvo.
    const transaction = db.transaction(() => {
      // Verifica disponibilidade do item dentro da transação
      const item = db.prepare(
        "SELECT status FROM items WHERE itemId = ?"
      ).get(itemId);

      if (!item || item.status !== 'available') {
        throw Object.assign(new Error('Item não disponível para reserva.'), { code: 'UNAVAILABLE' });
      }

      db.prepare(`
        INSERT INTO reservations (reservationId, itemId, donorId, receiverId, status, createdAt, updatedAt)
        VALUES (@reservationId, @itemId, @donorId, @receiverId, 'pending', @createdAt, @updatedAt)
      `).run({ reservationId, itemId, donorId, receiverId, createdAt: now, updatedAt: now });

      db.prepare(
        "UPDATE items SET status = 'reserved', updatedAt = ? WHERE itemId = ?"
      ).run(now, itemId);
    });

    transaction();

    return ReservationModel.findById(reservationId);
  },

  findById(reservationId) {
    return db.prepare(
      'SELECT * FROM reservations WHERE reservationId = ?'
    ).get(reservationId) || null;
  },

  listByReceiver(receiverId) {
    return db.prepare(
      'SELECT * FROM reservations WHERE receiverId = ? ORDER BY createdAt DESC'
    ).all(receiverId);
  },

  listByDonor(donorId) {
    return db.prepare(
      'SELECT * FROM reservations WHERE donorId = ? ORDER BY createdAt DESC'
    ).all(donorId);
  },

  updateStatus(reservationId, newStatus) {
    if (!VALID_STATUSES.includes(newStatus)) {
      throw new Error(`Status inválido. Use: ${VALID_STATUSES.join(', ')}`);
    }

    const now = new Date().toISOString();

    const transaction = db.transaction(() => {
      const reservation = db.prepare(
        'SELECT * FROM reservations WHERE reservationId = ?'
      ).get(reservationId);

      if (!reservation) {
        throw Object.assign(new Error('Reserva não encontrada.'), { code: 'NOT_FOUND' });
      }

      db.prepare(
        'UPDATE reservations SET status = ?, updatedAt = ? WHERE reservationId = ?'
      ).run(newStatus, now, reservationId);

      // Propaga o status para o item
      if (newStatus === 'completed') {
        db.prepare(
          "UPDATE items SET status = 'completed', updatedAt = ? WHERE itemId = ?"
        ).run(now, reservation.itemId);
      } else if (newStatus === 'cancelled') {
        db.prepare(
          "UPDATE items SET status = 'available', updatedAt = ? WHERE itemId = ?"
        ).run(now, reservation.itemId);
      }
    });

    transaction();

    return ReservationModel.findById(reservationId);
  },
};

module.exports = ReservationModel;
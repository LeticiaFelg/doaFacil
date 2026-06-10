// src/models/Item.js

const db = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

const VALID_CATEGORIES = ['moveis','eletro','roupas','calcados','utensilios','escolar','brinquedos','outros'];
const VALID_CONDITIONS = ['otimo','bom','usado'];
const VALID_STATUSES   = ['available','reserved','completed'];

const ItemModel = {

  create({ donorId, title, description, category, condition, location = {}, imageUrl = null }) {
    if (!VALID_CATEGORIES.includes(category)) {
      throw new Error(`Categoria inválida. Use: ${VALID_CATEGORIES.join(', ')}`);
    }
    if (!VALID_CONDITIONS.includes(condition)) {
      throw new Error(`Condição inválida. Use: ${VALID_CONDITIONS.join(', ')}`);
    }

    const now    = new Date().toISOString();
    const itemId = uuidv4();

    db.prepare(`
      INSERT INTO items
        (itemId, donorId, title, description, category, condition, status, neighborhood, city, imageUrl, createdAt, updatedAt)
      VALUES
        (@itemId, @donorId, @title, @description, @category, @condition, 'available', @neighborhood, @city, @imageUrl, @createdAt, @updatedAt)
    `).run({
      itemId,
      donorId,
      title:        title.trim(),
      description:  description?.trim() || null,
      category,
      condition,
      neighborhood: location.neighborhood || null,
      city:         location.city         || null,
      imageUrl,
      createdAt:    now,
      updatedAt:    now,
    });

    return ItemModel.findById(itemId);
  },

  findById(itemId) {
    return ItemModel._format(
      db.prepare('SELECT * FROM items WHERE itemId = ?').get(itemId)
    );
  },

  list({ category, status = 'available', search } = {}) {
    let query  = 'WHERE status = ?';
    const args = [status];

    if (category && VALID_CATEGORIES.includes(category)) {
      query += ' AND category = ?';
      args.push(category);
    }
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      args.push(`%${search}%`, `%${search}%`);
    }

    return db.prepare(`SELECT * FROM items ${query} ORDER BY createdAt DESC`)
      .all(...args)
      .map(ItemModel._format);
  },

  listByDonor(donorId) {
    return db.prepare(
      'SELECT * FROM items WHERE donorId = ? ORDER BY createdAt DESC'
    ).all(donorId).map(ItemModel._format);
  },

  update(itemId, donorId, updates) {
    const allowed = ['title','description','category','condition','status','imageUrl'];
    const fields  = {};

    for (const key of allowed) {
      if (updates[key] === undefined) continue;
      if (key === 'category' && !VALID_CATEGORIES.includes(updates[key])) continue;
      if (key === 'condition' && !VALID_CONDITIONS.includes(updates[key])) continue;
      if (key === 'status'    && !VALID_STATUSES.includes(updates[key]))   continue;
      fields[key] = updates[key];
    }

    if (updates.location) {
      if (updates.location.neighborhood !== undefined) fields.neighborhood = updates.location.neighborhood;
      if (updates.location.city         !== undefined) fields.city         = updates.location.city;
    }

    if (Object.keys(fields).length === 0) {
      throw new Error('Nenhum campo válido para atualizar.');
    }

    fields.updatedAt = new Date().toISOString();

    // Verifica se o item pertence ao doador antes de atualizar
    const existing = db.prepare(
      'SELECT itemId FROM items WHERE itemId = ? AND donorId = ?'
    ).get(itemId, donorId);

    if (!existing) throw Object.assign(new Error('Não encontrado ou sem permissão.'), { code: 'NOT_FOUND' });

    const setClause = Object.keys(fields).map((k) => `${k} = @${k}`).join(', ');
    db.prepare(`UPDATE items SET ${setClause} WHERE itemId = @itemId`)
      .run({ ...fields, itemId });

    return ItemModel.findById(itemId);
  },

  // Atualiza apenas a imageUrl (usado após upload)
  updateImage(itemId, donorId, imageUrl) {
    const existing = db.prepare(
      'SELECT itemId FROM items WHERE itemId = ? AND donorId = ?'
    ).get(itemId, donorId);

    if (!existing) throw Object.assign(new Error('Não encontrado ou sem permissão.'), { code: 'NOT_FOUND' });

    db.prepare(
      'UPDATE items SET imageUrl = ?, updatedAt = ? WHERE itemId = ?'
    ).run(imageUrl, new Date().toISOString(), itemId);

    return ItemModel.findById(itemId);
  },

  delete(itemId, donorId) {
    const existing = db.prepare(
      'SELECT itemId FROM items WHERE itemId = ? AND donorId = ?'
    ).get(itemId, donorId);

    if (!existing) throw Object.assign(new Error('Não encontrado ou sem permissão.'), { code: 'NOT_FOUND' });

    db.prepare('DELETE FROM items WHERE itemId = ?').run(itemId);
    return true;
  },

  // Formata linha do SQLite para o mesmo formato da API anterior
  _format(row) {
    if (!row) return null;
    const { neighborhood, city, ...rest } = row;
    return { ...rest, location: { neighborhood, city } };
  },
};

module.exports = ItemModel;
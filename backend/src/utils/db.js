// src/utils/db.js
// Conexão SQLite compartilhada.
// O banco é criado automaticamente se o arquivo não existir.
// Basta rodar "npm start" — nenhuma configuração extra necessária.

const Database = require('better-sqlite3');
const path     = require('path');

const DB_PATH = path.resolve(process.env.DB_PATH || './doafacil.db');

const db = new Database(DB_PATH);

// WAL mode: melhora performance em leituras e escritas simultâneas
db.pragma('journal_mode = WAL');
// Ativa checagem de chaves estrangeiras
db.pragma('foreign_keys = ON');

// ── Criação das tabelas (só executa se não existirem) ────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    userId      TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    phone       TEXT,
    street      TEXT,
    neighborhood TEXT,
    city        TEXT,
    state       TEXT,
    profileType TEXT NOT NULL DEFAULT 'both',
    createdAt   TEXT NOT NULL,
    updatedAt   TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS items (
    itemId      TEXT PRIMARY KEY,
    donorId     TEXT NOT NULL,
    title       TEXT NOT NULL,
    description TEXT,
    category    TEXT NOT NULL,
    condition   TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'available',
    neighborhood TEXT,
    city        TEXT,
    imageUrl    TEXT,
    createdAt   TEXT NOT NULL,
    updatedAt   TEXT NOT NULL,
    FOREIGN KEY (donorId) REFERENCES users(userId)
  );

  CREATE TABLE IF NOT EXISTS reservations (
    reservationId TEXT PRIMARY KEY,
    itemId        TEXT NOT NULL,
    donorId       TEXT NOT NULL,
    receiverId    TEXT NOT NULL,
    status        TEXT NOT NULL DEFAULT 'pending',
    createdAt     TEXT NOT NULL,
    updatedAt     TEXT NOT NULL,
    FOREIGN KEY (itemId)     REFERENCES items(itemId),
    FOREIGN KEY (donorId)    REFERENCES users(userId),
    FOREIGN KEY (receiverId) REFERENCES users(userId)
  );
`);

console.log(`[DB] SQLite conectado em: ${DB_PATH}`);

module.exports = db;
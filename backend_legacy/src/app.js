// src/app.js
require('dotenv').config(); // Lê o .env na raiz do backend

const express = require('express');
const cors    = require('cors');
const path    = require('path');

// Inicia o banco (cria o arquivo .db e as tabelas se não existirem)
require('./utils/db');

const usersRouter        = require('./routes/users');
const itemsRouter        = require('./routes/items');
const reservationsRouter = require('./routes/reservations');

const app = express();

// ─── CORS ─────────────────────────────────────────────────
app.use(cors({
  origin:         process.env.CORS_ORIGIN || '*',
  methods:        ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Arquivos estáticos: imagens enviadas por upload ──────
// Acessível em: http://localhost:3000/uploads/nome-do-arquivo.jpg
const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || './uploads');
app.use('/uploads', express.static(UPLOADS_DIR));

// ─── Health check ─────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'doafacil-api', timestamp: new Date().toISOString() });
});

// ─── Rotas ────────────────────────────────────────────────
app.use('/api/users',        usersRouter);
app.use('/api/items',        itemsRouter);
app.use('/api/reservations', reservationsRouter);

// ─── 404 ──────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// ─── Error handler global ─────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Erro não tratado]', err);
  res.status(500).json({ error: 'Erro interno inesperado.' });
});

// ─── Start ────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🌿 DoaFácil API → http://localhost:${PORT}`);
  console.log(`   Uploads     → http://localhost:${PORT}/uploads/`);
  console.log(`   Health      → http://localhost:${PORT}/api/health\n`);
});
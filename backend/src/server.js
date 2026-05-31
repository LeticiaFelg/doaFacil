require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Modelos
const User = require('./models/User');
const Item = require('./models/Item');
const Reservation = require('./models/Reservation');
require('./models/History');

// Rotas
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const userRoutes = require('./routes/users');
const reservationRoutes = require('./routes/reservations');
const historyRoutes = require('./routes/history');

const app = express();

const allowedOrigins = [
'http://localhost:3000',
'http://localhost:5000',
'http://localhost:5500',
'http://localhost:8000',
'http://localhost:8080',
'http://127.0.0.1:3000',
'http://127.0.0.1:5000',
'http://127.0.0.1:5500',
'http://127.0.0.1:8000',
'http://127.0.0.1:8080',
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Associações
Item.belongsTo(User, { as: 'donor', foreignKey: 'donor_id' });
User.hasMany(Item, { foreignKey: 'donor_id' });
Reservation.belongsTo(User, { as: 'receiver', foreignKey: 'user_id' });
Reservation.belongsTo(User, { as: 'donor', foreignKey: 'donor_id' });
Reservation.belongsTo(Item, { as: 'item', foreignKey: 'item_id' });

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/history', historyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API DoaFacil esta funcionando'
  });
});

// Error handlers
app.use((req, res) => {
  res.status(404).json({ error: 'Rota nao encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicializar DB e servidor
const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`DoaFacil API rodando em http://localhost:${PORT}`);
    console.log('Banco de dados sincronizado');
  });
}).catch(err => {
  console.error('Erro ao conectar ao banco de dados:', err);
  process.exit(1);
});

module.exports = app;

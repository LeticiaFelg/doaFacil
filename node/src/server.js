require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Modelos
const User = require('./models/User');
const Item = require('./models/Item');
const Reservation = require('./models/Reservation');
const History = require('./models/History');

// Rotas
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const userRoutes = require('./routes/users');
const reservationRoutes = require('./routes/reservations');
const historyRoutes = require('./routes/history');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8000'
}));
app.use(express.json());

// Definir associações
Item.belongsTo(User, { as: 'donor', foreignKey: 'donor_id' });
User.hasMany(Item, { foreignKey: 'donor_id' });
Reservation.belongsTo(Item, { as: 'item', foreignKey: 'item_id' });
Reservation.belongsTo(User, { as: 'receiver', foreignKey: 'user_id' });
Reservation.belongsTo(User, { as: 'donor', foreignKey: 'donor_id' });
Item.hasMany(Reservation, { foreignKey: 'item_id' });
User.hasMany(Reservation, { as: 'receivedReservations', foreignKey: 'user_id' });
User.hasMany(Reservation, { as: 'donationReservations', foreignKey: 'donor_id' });

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
    message: 'API DoaFácil está funcionando'
  });
});

// Error handlers
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// Inicializar DB e servidor
const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🌿 DoaFácil API rodando em http://localhost:${PORT}`);
    console.log(`📊 Banco de dados sincronizado`);
  });
}).catch(err => {
  console.error('Erro ao conectar ao banco de dados:', err);
  process.exit(1);
});

module.exports = app;

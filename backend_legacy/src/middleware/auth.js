// src/middleware/auth.js
// Middleware que valida o token JWT em rotas protegidas.

const jwt = require('jsonwebtoken');

/**
 * Uso: router.get('/rota-protegida', authMiddleware, handler)
 *
 * Adiciona req.user = { userId, email } quando o token é válido.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Faça login novamente.' });
    }
    return res.status(401).json({ error: 'Token inválido.' });
  }
};

module.exports = authMiddleware;

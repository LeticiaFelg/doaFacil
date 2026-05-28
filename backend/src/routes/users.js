// src/routes/users.js
// Endpoints: cadastro, login, perfil, edição, troca de senha e exclusão.

const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const UserModel      = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ─── Helpers ──────────────────────────────────────────────

/** Valida formato de e-mail sem dependência externa. */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Gera um JWT com os dados do usuário. */
function generateToken(user) {
  return jwt.sign(
    { userId: user.userId, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ─── POST /api/users/register ─────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, profileType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Formato de e-mail inválido.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'A senha deve ter no mínimo 6 caracteres.' });
    }

    const user  = await UserModel.create({ name, email, password, phone, address, profileType });
    const token = generateToken(user);

    return res.status(201).json({ user, token });
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      return res.status(409).json({ error: 'E-mail já cadastrado.' });
    }
    console.error('[POST /register]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── POST /api/users/login ────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Formato de e-mail inválido.' });
    }

    const userWithHash = await UserModel.findByEmailWithHash(email);
    if (!userWithHash) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const passwordMatch = await bcrypt.compare(password, userWithHash.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = generateToken(userWithHash);
    return res.json({ user: UserModel._sanitize(userWithHash), token });
  } catch (err) {
    console.error('[POST /login]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── GET /api/users/me ────────────────────────────────────
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.json({ user });
  } catch (err) {
    console.error('[GET /me]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── GET /api/users/:id ───────────────────────────────────
// Perfil público: retorna apenas dados não sensíveis.
router.get('/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    return res.json({
      user: {
        userId:      user.userId,
        name:        user.name,
        profileType: user.profileType,
        createdAt:   user.createdAt,
      },
    });
  } catch (err) {
    console.error('[GET /:id]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── PUT /api/users/me ────────────────────────────────────
// Atualiza dados do perfil (sem senha — use a rota /me/password).
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const updated = await UserModel.update(req.user.userId, req.body);
    return res.json({ user: updated });
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    if (err.message === 'Nenhum campo válido para atualizar.') {
      return res.status(400).json({ error: err.message });
    }
    console.error('[PUT /me]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── PUT /api/users/me/password ──────────────────────────
// Troca a senha do usuário logado.
// Exige a senha atual para confirmar a identidade.
router.put('/me/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'A nova senha deve ter no mínimo 6 caracteres.' });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ error: 'A nova senha deve ser diferente da senha atual.' });
    }

    // Busca o usuário com o hash para verificar a senha atual
    const userWithHash = await UserModel.findByIdWithHash(req.user.userId);
    if (!userWithHash) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, userWithHash.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Senha atual incorreta.' });
    }

    await UserModel.updatePassword(req.user.userId, newPassword);
    return res.json({ message: 'Senha atualizada com sucesso.' });
  } catch (err) {
    console.error('[PUT /me/password]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// ─── DELETE /api/users/me ─────────────────────────────────
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    await UserModel.delete(req.user.userId);
    return res.json({ message: 'Conta deletada com sucesso.' });
  } catch (err) {
    if (err.name === 'ConditionalCheckFailedException') {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    console.error('[DELETE /me]', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
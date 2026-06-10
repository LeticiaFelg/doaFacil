const crypto = require('crypto');
const PasswordReset = require('../models/PasswordReset');
const { sendEmail } = require('./emailService');

const RESET_TOKEN_BYTES = 32;
const RESET_TOKEN_TTL_MINUTES = 15;

function createResetToken() {
  return crypto.randomBytes(RESET_TOKEN_BYTES).toString('hex');
}

function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function getResetTokenExpirationDate() {
  return new Date(Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000);
}

function buildPasswordResetUrl(token) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8000';
  const normalizedFrontendUrl = frontendUrl.replace(/\/$/, '');

  return `${normalizedFrontendUrl}/pages/redefinir-senha.html?token=${token}`;
}

async function invalidatePreviousPasswordResets(userId) {
  await PasswordReset.update(
    { used_at: new Date() },
    { where: { user_id: userId, used_at: null } }
  );
}

async function createPasswordResetToken(userId) {
  const token = createResetToken();

  await invalidatePreviousPasswordResets(userId);
  await PasswordReset.create({
    user_id: userId,
    token_hash: hashResetToken(token),
    expires_at: getResetTokenExpirationDate()
  });

  return token;
}

async function findValidPasswordReset(token) {
  if (!token) {
    return null;
  }

  const passwordReset = await PasswordReset.findOne({
    where: {
      token_hash: hashResetToken(token),
      used_at: null
    }
  });

  if (!passwordReset || passwordReset.expires_at <= new Date()) {
    return null;
  }

  return passwordReset;
}

async function markPasswordResetAsUsed(passwordReset) {
  passwordReset.used_at = new Date();
  await passwordReset.save();
}

function buildPasswordResetEmail(user, resetUrl) {
  const subject = 'Redefinicao de senha - DoaFacil';
  const text = [
    `Ola, ${user.name}.`,
    '',
    'Recebemos uma solicitacao para redefinir sua senha no DoaFacil.',
    `Acesse o link abaixo em ate ${RESET_TOKEN_TTL_MINUTES} minutos:`,
    '',
    resetUrl,
    '',
    'Se voce nao solicitou essa redefinicao, ignore este e-mail.'
  ].join('\n');

  const html = `
    <p>Ola, ${user.name}.</p>
    <p>Recebemos uma solicitacao para redefinir sua senha no DoaFacil.</p>
    <p>Acesse o link abaixo em ate ${RESET_TOKEN_TTL_MINUTES} minutos:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>Se voce nao solicitou essa redefinicao, ignore este e-mail.</p>
  `;

  return { subject, text, html };
}

async function sendPasswordResetEmail(user, token) {
  const resetUrl = buildPasswordResetUrl(token);
  const email = buildPasswordResetEmail(user, resetUrl);

  return sendEmail({
    to: user.email,
    subject: email.subject,
    text: email.text,
    html: email.html
  });
}

module.exports = {
  RESET_TOKEN_TTL_MINUTES,
  createPasswordResetToken,
  findValidPasswordReset,
  hashResetToken,
  markPasswordResetAsUsed,
  sendPasswordResetEmail
};

const nodemailer = require('nodemailer');

let etherealTestAccount = null;

function getEmailProvider() {
  return (process.env.EMAIL_PROVIDER || '').trim().toLowerCase();
}

function hasSmtpConfig() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function createSmtpTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function getEtherealTestAccount() {
  if (!etherealTestAccount) {
    etherealTestAccount = await nodemailer.createTestAccount();
  }

  return etherealTestAccount;
}

async function createEtherealTransporter() {
  const account = await getEtherealTestAccount();

  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });
}

function logDevelopmentEmail({ to, subject, text }) {
  console.log('[DoaFacil email - modo desenvolvimento]');
  console.log(`Para: ${to}`);
  console.log(`Assunto: ${subject}`);
  console.log(text);
}

function logEtherealPreviewUrl(info) {
  const previewUrl = nodemailer.getTestMessageUrl(info);

  if (previewUrl) {
    console.log(`[DoaFacil email - Ethereal preview] ${previewUrl}`);
  }
}

async function sendWithEthereal(message) {
  const transporter = await createEtherealTransporter();
  const info = await transporter.sendMail(message);

  logEtherealPreviewUrl(info);

  return { delivered: true, mode: 'ethereal', previewUrl: nodemailer.getTestMessageUrl(info) };
}

async function sendWithSmtp(message) {
  const transporter = createSmtpTransporter();
  await transporter.sendMail(message);

  return { delivered: true, mode: 'smtp' };
}

async function sendEmail({ to, subject, text, html }) {
  const message = {
    from: process.env.SMTP_FROM || process.env.SMTP_USER || 'DoaFacil <no-reply@doafacil.local>',
    to,
    subject,
    text,
    html
  };
  const provider = getEmailProvider();

  if (provider === 'ethereal') {
    return sendWithEthereal(message);
  }

  if (provider === 'smtp' || hasSmtpConfig()) {
    return sendWithSmtp(message);
  }

  if (process.env.NODE_ENV === 'development') {
    logDevelopmentEmail({ to, subject, text });
    return { delivered: false, mode: 'development-log' };
  }

  throw new Error('Configuracao de e-mail indisponivel');
}

module.exports = { sendEmail };

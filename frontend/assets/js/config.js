/**
 * assets/js/config.js
 *
 * Configuração central do frontend.
 * Este arquivo define `window.API_BASE_URL` que o `assets/js/api.js`
 * usa como base para todas as chamadas à API.
 *
 * Fluxo recomendado:
 * - Durante desenvolvimento local: use http://localhost:5000/api
 * - Em produção (S3 + Cloudflare Tunnel): use https://<SEU_TUNNEL>/api
 *
 * Antes de enviar ao S3, atualize a constante PROD_API abaixo com
 * o hostname do seu tunnel (ex: doafacil-api.meugrupo.workers.dev).
 */

// URL do backend em produção (Cloudflare Tunnel). Substitua pelo seu domínio.
const PROD_API = 'https://doafacil-api.SEU-DOMINIO.workers.dev/api';

// URL para desenvolvimento local
const DEV_API = 'http://localhost:8000/api';

// Auto-detecção: quando estiver em localhost, usa o DEV_API; caso contrário, usa PROD_API
// Isso evita editar o arquivo manualmente em muitos lugares durante testes locais.
(function setApiBase() {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    window.API_BASE_URL = DEV_API;
  } else {
    window.API_BASE_URL = PROD_API;
  }
});

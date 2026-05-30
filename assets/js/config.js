/**
 * assets/js/config.js
 *
 * Configuração central do frontend.
 * É o ÚNICO arquivo que precisa ser alterado quando a URL
 * do Cloudflare Tunnel mudar (o que é raro — a URL é fixa).
 *
 * Adicione este script ANTES de api.js em todos os HTMLs:
 *   <script src="../assets/js/config.js"></script>
 *   <script src="../assets/js/api.js"></script>
 */
// Para produção, utilizando Cloudflare Tunnel
// window.API_BASE_URL = 'https://doafacil-api.SEU-DOMINIO.workers.dev/api';
//
// ↑ Troque pelo seu subdomínio Cloudflare após configurar o tunnel.
//   Exemplo real: 'https://doafacil-api.meugrupo.workers.dev/api'
//
// Para testes locais (sem o tunnel), troque por:
window.API_BASE_URL = 'http://localhost:5000/api';

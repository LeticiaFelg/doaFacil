/**
 * assets/js/api.js
 * Camada de comunicação com a API DoaFácil usando jQuery AJAX.
 *
 * Como usar nos HTMLs:
 *   <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
 *   <script src="../assets/js/api.js"></script>
 */

// ─── Configuração base ─────────────────────────────────────
const DoaFacilAPI = (() => {
  // Troque pela URL do API Gateway após o deploy
  const BASE_URL = window.API_BASE_URL || 'http://localhost:5000/';

  /**
   * Retorna os headers padrão. Inclui Authorization se houver token salvo.
   */
  function _getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('doafacil_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  /**
   * Wrapper jQuery AJAX que centraliza tratamento de erro e token.
   */
  function _request(method, endpoint, data = null) {
    return $.ajax({
      url: `${BASE_URL}${endpoint}`,
      method,
      headers: _getHeaders(),
      contentType: 'application/json',
      data: data ? JSON.stringify(data) : null,
    }).fail((jqXHR) => {
      // Token expirado: redireciona para login
      const isAuthAttempt = endpoint === '/users/login' || endpoint === '/users/register';
      if (jqXHR.status === 401 && !isAuthAttempt) {
        localStorage.removeItem('doafacil_token');
        localStorage.removeItem('doafacil_user');
        window.location.href = '/pages/login.html';
      }
    });
  }

  // ── Auth ────────────────────────────────────────────────
  const Auth = {
    /**
     * Cadastra novo usuário.
     * @param {{ name, email, password, phone, address, profileType }} data
     */
    register(data) {
      return _request('POST', '/users/register', data).done(({ user, token, access_token }) => {
        localStorage.setItem('doafacil_token', token || access_token);
        localStorage.setItem('doafacil_user', JSON.stringify(user));
        localStorage.setItem('doafacil_current_user', JSON.stringify(user));
      });
    },

    /**
     * Faz login.
     * @param {{ email, password }} credentials
     */
    login(credentials) {
      return _request('POST', '/users/login', credentials).done(({ user, token, access_token }) => {
        localStorage.setItem('doafacil_token', token || access_token);
        localStorage.setItem('doafacil_user', JSON.stringify(user));
        localStorage.setItem('doafacil_current_user', JSON.stringify(user));
      });
    },

    logout() {
      return _request('POST', '/users/logout').always(() => {
        localStorage.removeItem('doafacil_token');
        localStorage.removeItem('doafacil_user');
        localStorage.removeItem('doafacil_current_user');
        window.location.href = '/pages/login.html';
      });
    },

    isLoggedIn() {
      return !!localStorage.getItem('doafacil_token');
    },

    getCurrentUser() {
      const raw = localStorage.getItem('doafacil_user');
      return raw ? JSON.parse(raw) : null;
    },

    deleteAccount() {
      return _request('DELETE', '/users/me').always(() => {
        localStorage.removeItem('doafacil_token');
        localStorage.removeItem('doafacil_user');
        localStorage.removeItem('doafacil_current_user');
      });
    },
  };

  // ── Usuários ─────────────────────────────────────────────
  const Users = {
    getMe()              { return _request('GET',    '/users/me');    },
    getById(id)          { return _request('GET',    `/users/${id}`); },
    updateMe(data)       { return _request('PUT',    '/users/me', data); },
    deleteMe()           { return _request('DELETE', '/users/me'); },
  };

  // ── Itens ────────────────────────────────────────────────
  const Items = {
    list(filters = {}) {
      const params = $.param(filters);
      return _request('GET', `/items${params ? '?' + params : ''}`);
    },
    listMine()           { return _request('GET',    '/items/my');    },
    getById(id)          { return _request('GET',    `/items/${id}`); },
    getWhatsAppContact(id) { return _request('POST', `/items/${id}/contact/whatsapp`); },
    create(data)         { return _request('POST',   '/items', data); },
    update(id, data)     { return _request('PUT',    `/items/${id}`, data); },
    delete(id)           { return _request('DELETE', `/items/${id}`); },
  };

  // ── Reservas ─────────────────────────────────────────────
  const Reservations = {
    create(itemId)         { return _request('POST',  '/reservations', { itemId }); },
    getReceived()          { return _request('GET',   '/reservations/received'); },
    getDonated()           { return _request('GET',   '/reservations/donated'); },
    getById(id)            { return _request('GET',   `/reservations/${id}`); },
    updateStatus(id, status) {
      return _request('PATCH', `/reservations/${id}/status`, { status });
    },
  };

  // â”€â”€ HistÃ³rico â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const History = {
    getMine() { return _request('GET', '/history/my'); },
  };

  return { Auth, Users, Items, Reservations, History };
})();

window.DoaFacilAPI = DoaFacilAPI;

// ─── Exemplos de uso (jQuery) nos HTMLs ────────────────────
//
// LOGIN:
//   DoaFacilAPI.Auth.login({ email, password })
//     .done(({ user }) => console.log('Bem-vindo,', user.name))
//     .fail(({ responseJSON }) => alert(responseJSON.error));
//
// LISTAR ITENS COM FILTRO:
//   DoaFacilAPI.Items.list({ category: 'moveis', search: 'sofá' })
//     .done(({ items }) => renderFeed(items));
//
// RESERVAR ITEM:
//   DoaFacilAPI.Reservations.create(itemId)
//     .done(() => alert('Reserva feita!'))
//     .fail(() => alert('Item indisponível.'));
//
// HISTÓRICO:
//   DoaFacilAPI.Reservations.getReceived()
//     .done(({ reservations }) => renderHistorico(reservations));

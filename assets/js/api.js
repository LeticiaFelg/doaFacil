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
  const BASE_URL = window.API_BASE_URL || 'http://localhost:5000/api';

  function _endpoint(path) {
    return `${BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
  }

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
      url: _endpoint(endpoint),
      method,
      headers: _getHeaders(),
      contentType: 'application/json',
      data: data ? JSON.stringify(data) : null,
    }).fail((jqXHR) => {
      // Token expirado: redireciona para login
      const isAuthRequest = endpoint.includes('/auth/login') || endpoint.includes('/auth/register');
      if (jqXHR.status === 401 && !isAuthRequest) {
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
      const roles = data.roles || (
        data.profileType === 'both' ? ['doador', 'receptor'] :
        data.profileType === 'receiver' ? ['receptor'] :
        ['doador']
      );
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        location: data.location || data.address?.neighborhood || '',
        roles,
        avatar: data.avatar
      };

      return _request('POST', '/auth/register', payload).done(({ user, access_token }) => {
        localStorage.setItem('doafacil_token', access_token);
        localStorage.setItem('doafacil_user', JSON.stringify(user));
      });
    },

    /**
     * Faz login.
     * @param {{ email, password }} credentials
     */
    login(credentials) {
      return _request('POST', '/auth/login', credentials).done(({ user, access_token }) => {
        localStorage.setItem('doafacil_token', access_token);
        localStorage.setItem('doafacil_user', JSON.stringify(user));
      });
    },

    logout() {
      localStorage.removeItem('doafacil_token');
      localStorage.removeItem('doafacil_user');
      window.location.href = '/pages/login.html';
    },

    isLoggedIn() {
      return !!localStorage.getItem('doafacil_token');
    },

    getCurrentUser() {
      const raw = localStorage.getItem('doafacil_user');
      return raw ? JSON.parse(raw) : null;
    },
  };

  // ── Usuários ─────────────────────────────────────────────
  const Users = {
    getMe()              { return _request('GET',    '/users/me/profile'); },
    getById(id)          { return _request('GET',    `/users/${id}`); },
    updateMe(data)       { return _request('PUT',    '/users/me/profile', data); },
    listMyDonations()    { return _request('GET',    '/users/me/donations'); },
  };

  // ── Itens ────────────────────────────────────────────────
  const Items = {
    list(filters = {}) {
      const params = $.param(filters);
      return _request('GET', `/items${params ? '?' + params : ''}`);
    },
    listMine()           { return _request('GET',    '/users/me/donations'); },
    getById(id)          { return _request('GET',    `/items/${id}`); },
    create(data)         { return _request('POST',   '/items', data); },
    update(id, data)     { return _request('PUT',    `/items/${id}`, data); },
    delete(id)           { return _request('DELETE', `/items/${id}`); },
  };

  // ── Reservas ─────────────────────────────────────────────
  const Reservations = {
    create(itemId, message = '') {
      return _request('POST', '/reservations', { item_id: itemId, message });
    },
    getPending()           { return _request('GET',   '/reservations/my/pending'); },
    getByItem(itemId)      { return _request('GET',   `/reservations/item/${itemId}`); },
    getById(id)            { return _request('GET',   `/reservations/${id}`); },
    confirm(id)            { return _request('PUT',   `/reservations/${id}/confirm`); },
    complete(id)           { return _request('PUT',   `/reservations/${id}/complete`); },
    cancel(id)             { return _request('PUT',   `/reservations/${id}/cancel`); },
  };

  const History = {
    myDonations(filters = {}) {
      const params = $.param(filters);
      return _request('GET', `/history/my/donations${params ? '?' + params : ''}`);
    },
    myReceived(filters = {}) {
      const params = $.param(filters);
      return _request('GET', `/history/my/received${params ? '?' + params : ''}`);
    },
    myStatistics()         { return _request('GET', '/history/my/statistics'); },
    statistics()           { return _request('GET', '/history/statistics'); },
  };

  return { Auth, Users, Items, Reservations, History };
})();

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
//   DoaFacilAPI.History.myDonations()
//     .done(({ donations }) => renderHistorico(donations));

/**
 * assets/js/api.js
 * Camada de comunicacao com a API DoaFacil usando jQuery AJAX.
 */

const DoaFacilAPI = (() => {
  const BASE_URL = (window.API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

  function endpoint(path) {
    return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  }

  function getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('doafacil_token');
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  }

  function request(method, path, data = null) {
    return $.ajax({
      url: endpoint(path),
      method,
      headers: getHeaders(),
      contentType: 'application/json',
      data: data ? JSON.stringify(data) : null
    }).fail((jqXHR) => {
      if (jqXHR.status === 401) {
        localStorage.removeItem('doafacil_token');
        localStorage.removeItem('doafacil_user');
        if (!window.location.pathname.endsWith('/login.html')) {
          window.location.href = '/pages/login.html';
        }
      }
    });
  }

  function saveSession(response) {
    const token = response.access_token || response.token;
    if (token) localStorage.setItem('doafacil_token', token);
    if (response.user) localStorage.setItem('doafacil_user', JSON.stringify(response.user));
  }

  function profileTypeToRoles(profileType) {
    if (profileType === 'both') return ['doador', 'receptor'];
    if (profileType === 'receiver') return ['receptor'];
    return ['doador'];
  }

  const Auth = {
    register(data) {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        location: typeof data.address === 'string'
          ? data.address
          : data.address?.neighborhood || data.location || '',
        roles: data.roles || profileTypeToRoles(data.profileType),
        avatar: data.avatar
      };

      return request('POST', '/auth/register', payload).done(saveSession);
    },

    login(credentials) {
      return request('POST', '/auth/login', credentials).done(saveSession);
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

    me() {
      return request('GET', '/auth/me');
    }
  };

  const Users = {
    getMe() {
      return request('GET', '/users/me/profile').then((response) => response.user || response);
    },
    getById(id) {
      return request('GET', `/users/${id}`);
    },
    updateMe(data) {
      return request('PUT', '/users/me/profile', data);
    },
    search(filters = {}) {
      const params = $.param(filters);
      return request('GET', `/users/search${params ? `?${params}` : ''}`);
    },
    statistics(id) {
      return request('GET', `/users/${id}/statistics`);
    }
  };

  const Items = {
    list(filters = {}) {
      const params = $.param(filters);
      return request('GET', `/items${params ? `?${params}` : ''}`);
    },
    listMine() {
      return request('GET', '/users/me/donations');
    },
    getById(id) {
      return request('GET', `/items/${id}`);
    },
    create(data) {
      return request('POST', '/items', data);
    },
    update(id, data) {
      return request('PUT', `/items/${id}`, data);
    },
    delete(id) {
      return request('DELETE', `/items/${id}`);
    },
    byCategory(category, filters = {}) {
      const params = $.param(filters);
      return request('GET', `/items/category/${category}${params ? `?${params}` : ''}`);
    }
  };

  const Reservations = {
    create(itemId, message = '') {
      return request('POST', '/reservations', { item_id: itemId, message });
    },
    getPending() {
      return request('GET', '/reservations/my/pending');
    },
    getByItem(itemId) {
      return request('GET', `/reservations/item/${itemId}`);
    },
    getById(id) {
      return request('GET', `/reservations/${id}`);
    },
    confirm(id) {
      return request('PUT', `/reservations/${id}/confirm`);
    },
    complete(id) {
      return request('PUT', `/reservations/${id}/complete`);
    },
    cancel(id) {
      return request('PUT', `/reservations/${id}/cancel`);
    }
  };

  const History = {
    myDonations(filters = {}) {
      const params = $.param(filters);
      return request('GET', `/history/my/donations${params ? `?${params}` : ''}`);
    },
    myReceived(filters = {}) {
      const params = $.param(filters);
      return request('GET', `/history/my/received${params ? `?${params}` : ''}`);
    },
    myStatistics() {
      return request('GET', '/history/my/statistics');
    },
    globalStatistics() {
      return request('GET', '/history/statistics');
    }
  };

  return { Auth, Users, Items, Reservations, History };
})();

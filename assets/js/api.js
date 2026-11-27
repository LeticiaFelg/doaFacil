/**
 * assets/js/api-mock.js
 * Versão Client-Side Mock - DoaFácil (GitHub Pages)
 * 
 * API simulada que funciona 100% no navegador sem backend.
 * Usa localStorage para persistir dados durante a sessão.
 */

const DoaFacilAPI = (() => {
  
  // ─── Inicializa dados mockados ─────────────────────────────
  function _initMockData() {
    if (!localStorage.getItem('doafacil_mock_items')) {
      const mockItems = [
        { id: 1, title: 'Sofá de 3 lugares', category: 'moveis', images: ['./assets/img/items/item1.jpg'], condition: 'bom', description: 'Sofá em tecido cinza, leve desgaste nos braços.', donor_id: 999, donor: { name: 'Maria S.', location: 'Copacabana, RJ', verified: true }, status: 'disponivel', created_at: new Date().toISOString() },
        { id: 2, title: 'Guarda-roupa 4 portas', category: 'moveis', images: ['./assets/img/items/item2.jpg'], condition: 'bom', description: 'Madeira clara, espelho interno, sem trincas.', donor_id: 998, donor: { name: 'João P.', location: 'Botafogo, RJ', verified: false }, status: 'disponivel', created_at: new Date().toISOString() },
        { id: 3, title: 'Micro-ondas 30L', category: 'eletro', images: ['./assets/img/items/item3.jpg'], condition: 'otimo', description: 'Funcionando perfeitamente, acompanha prato giratório.', donor_id: 997, donor: { name: 'Ana C.', location: 'Tijuca, RJ', verified: true }, status: 'disponivel', created_at: new Date().toISOString() },
        { id: 4, title: 'Kit roupas infantis', category: 'roupas', images: ['./assets/img/items/item4.jpg'], condition: 'otimo', description: 'Tamanhos 4 a 8 anos, várias peças, bem conservadas.', donor_id: 996, donor: { name: 'Carlos M.', location: 'Méier, RJ', verified: true }, status: 'disponivel', created_at: new Date().toISOString() },
        { id: 5, title: 'Mesa de escritório', category: 'moveis', images: ['./assets/img/items/item5.jpg'], condition: 'usado', description: 'Mesa retangular 120x60cm, arranhões superficiais.', donor_id: 995, donor: { name: 'Lia F.', location: 'Centro, RJ', verified: false }, status: 'disponivel', created_at: new Date().toISOString() },
        { id: 6, title: 'Conjunto de panelas', category: 'utensilios', images: ['./assets/img/items/item6.jpg'], condition: 'bom', description: '5 peças, antiaderente, sem lascas.', donor_id: 994, donor: { name: 'Paulo T.', location: 'Realengo, RJ', verified: false }, status: 'disponivel', created_at: new Date().toISOString() },
        { id: 7, title: 'Tênis esportivo 42', category: 'calcados', images: ['./assets/img/items/item7.jpg'], condition: 'bom', description: 'Pouco uso, solado em bom estado.', donor_id: 993, donor: { name: 'Marcos L.', location: 'Jacarepaguá', verified: true }, status: 'disponivel', created_at: new Date().toISOString() },
        { id: 8, title: 'Livros didáticos', category: 'escolar', images: ['./assets/img/items/item8.jpg'], condition: 'otimo', description: 'Ensino médio, completos, sem anotações.', donor_id: 992, donor: { name: 'Beatriz N.', location: 'Vila Isabel', verified: false }, status: 'disponivel', created_at: new Date().toISOString() },
        { id: 9, title: 'Cama solteiro', category: 'moveis', images: ['./assets/img/items/item9.jpg'], condition: 'bom', description: 'Cama de madeira com colchão incluso, sem mofos.', donor_id: 991, donor: { name: 'Fernanda R.', location: 'Bonsucesso', verified: true }, status: 'disponivel', created_at: new Date().toISOString() },
        { id: 10, title: 'Brinquedos variados', category: 'brinquedos', images: ['./assets/img/items/item10.jpg'], condition: 'bom', description: 'Quebra-cabeças, carrinhos e bonecas.', donor_id: 990, donor: { name: 'Renata M.', location: 'Sulacap', verified: false }, status: 'disponivel', created_at: new Date().toISOString() },
        { id: 11, title: 'Geladeira 280L', category: 'eletro', images: ['./assets/img/items/item11.jpg'], condition: 'usado', description: 'Funciona bem, pequenas marcas externas.', donor_id: 989, donor: { name: 'Hugo S.', location: 'Bangu', verified: true }, status: 'disponivel', created_at: new Date().toISOString() },
        { id: 12, title: 'Mochila escolar', category: 'escolar', images: ['./assets/img/items/item12.jpg'], condition: 'otimo', description: 'Nova, nunca usada, tamanho médio.', donor_id: 988, donor: { name: 'Olivia C.', location: 'Santa Cruz', verified: false }, status: 'disponivel', created_at: new Date().toISOString() }
      ];
      localStorage.setItem('doafacil_mock_items', JSON.stringify(mockItems));
    }

    if (!localStorage.getItem('doafacil_mock_users')) {
      localStorage.setItem('doafacil_mock_users', JSON.stringify([]));
    }

    if (!localStorage.getItem('doafacil_mock_reservations')) {
      localStorage.setItem('doafacil_mock_reservations', JSON.stringify([]));
    }
  }

  _initMockData();

  // ─── Helpers ────────────────────────────────────────────────
  function _mockResponse(data, delay = 100) {
    const deferred = $.Deferred();
    setTimeout(() => deferred.resolve(data), delay);
    return deferred.promise();
  }

  function _mockError(message, status = 400, delay = 100) {
    const deferred = $.Deferred();
    setTimeout(() => {
      deferred.reject({
        status,
        responseJSON: { error: message }
      });
    }, delay);
    return deferred.promise();
  }

  function _getUsers() {
    return JSON.parse(localStorage.getItem('doafacil_mock_users') || '[]');
  }

  function _saveUsers(users) {
    localStorage.setItem('doafacil_mock_users', JSON.stringify(users));
  }

  function _getItems() {
    return JSON.parse(localStorage.getItem('doafacil_mock_items') || '[]');
  }

  function _saveItems(items) {
    localStorage.setItem('doafacil_mock_items', JSON.stringify(items));
  }

  function _getReservations() {
    return JSON.parse(localStorage.getItem('doafacil_mock_reservations') || '[]');
  }

  function _saveReservations(reservations) {
    localStorage.setItem('doafacil_mock_reservations', JSON.stringify(reservations));
  }

  function _getCurrentUser() {
    const userStr = localStorage.getItem('doafacil_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // ── Auth ────────────────────────────────────────────────────
  const Auth = {
    register(data) {
      const users = _getUsers();
      
      if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
        return _mockError('Email já cadastrado', 409);
      }

      if (!data.name || data.name.length < 3) {
        return _mockError('Nome deve ter pelo menos 3 caracteres');
      }
      if (!data.email || !data.email.includes('@')) {
        return _mockError('Email inválido');
      }
      if (!data.password || data.password.length < 6) {
        return _mockError('Senha deve ter pelo menos 6 caracteres');
      }

      const newUser = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        cpf: data.cpf || '',
        bairro: data.bairro || '',
        address: data.address || data.bairro || '',
        profileType: data.profileType || 'pessoa',
        verified: false,
        created_at: new Date().toISOString()
      };

      users.push(newUser);
      _saveUsers(users);

      const token = 'mock_token_' + newUser.id;
      localStorage.setItem('doafacil_token', token);
      localStorage.setItem('doafacil_user', JSON.stringify(newUser));
      localStorage.setItem('doafacil_current_user', JSON.stringify(newUser));
      localStorage.setItem('doafacil_fallback_session', 'true');

      return _mockResponse({ user: newUser, token });
    },

    login(credentials) {
      const users = _getUsers();
      const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());

      if (!user) {
        return _mockError('Email ou senha incorretos', 401);
      }

      const token = 'mock_token_' + user.id;
      localStorage.setItem('doafacil_token', token);
      localStorage.setItem('doafacil_user', JSON.stringify(user));
      localStorage.setItem('doafacil_current_user', JSON.stringify(user));
      localStorage.setItem('doafacil_fallback_session', 'true');

      return _mockResponse({ user, token });
    },

    forgotPassword(email) {
      return _mockResponse({ message: 'Email de recuperação enviado' });
    },

    resetPassword(token, password, confirmPassword) {
      return _mockResponse({ message: 'Senha redefinida com sucesso' });
    },

    logout() {
      localStorage.removeItem('doafacil_token');
      localStorage.removeItem('doafacil_user');
      localStorage.removeItem('doafacil_current_user');
      localStorage.removeItem('doafacil_fallback_session');
      return _mockResponse({ message: 'Logout realizado' });
    },

    isLoggedIn() {
      return !!localStorage.getItem('doafacil_token');
    },

    isFallbackSession() {
      return localStorage.getItem('doafacil_fallback_session') === 'true';
    },

    hasRealSession() {
      return this.isLoggedIn();
    },

    getCurrentUser() {
      const raw = localStorage.getItem('doafacil_user');
      return raw ? JSON.parse(raw) : null;
    },

    deleteAccount() {
      const currentUser = _getCurrentUser();
      if (!currentUser) {
        return _mockError('Não autenticado', 401);
      }

      const users = _getUsers();
      const filtered = users.filter(u => u.id !== currentUser.id);
      _saveUsers(filtered);

      localStorage.removeItem('doafacil_token');
      localStorage.removeItem('doafacil_user');
      localStorage.removeItem('doafacil_current_user');
      localStorage.removeItem('doafacil_fallback_session');

      return _mockResponse({ message: 'Conta excluída' });
    },
  };

  // ── Usuários ────────────────────────────────────────────────
  const Users = {
    getMe() {
      const user = _getCurrentUser();
      if (!user) {
        return _mockError('Não autenticado', 401);
      }
      return _mockResponse({ user });
    },

    getById(id) {
      const users = _getUsers();
      const user = users.find(u => u.id == id);
      if (!user) {
        return _mockError('Usuário não encontrado', 404);
      }
      return _mockResponse({ user });
    },

    updateMe(data) {
      const currentUser = _getCurrentUser();
      if (!currentUser) {
        return _mockError('Não autenticado', 401);
      }

      const users = _getUsers();
      const index = users.findIndex(u => u.id === currentUser.id);
      
      if (index === -1) {
        return _mockError('Usuário não encontrado', 404);
      }

      const updatedUser = { ...users[index], ...data, id: users[index].id };
      users[index] = updatedUser;
      _saveUsers(users);

      localStorage.setItem('doafacil_user', JSON.stringify(updatedUser));
      localStorage.setItem('doafacil_current_user', JSON.stringify(updatedUser));

      return _mockResponse({ user: updatedUser });
    },

    deleteMe() {
      return Auth.deleteAccount();
    },
  };

  // ── Itens ───────────────────────────────────────────────────
  const Items = {
    list(filters = {}) {
      let items = _getItems();

      if (filters.category && filters.category !== 'all') {
        items = items.filter(item => item.category === filters.category);
      }

      if (filters.search) {
        const search = filters.search.toLowerCase();
        items = items.filter(item =>
          item.title.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search)
        );
      }

      if (filters.status !== 'all') {
        items = items.filter(item => item.status === 'disponivel');
      }

      return _mockResponse({ items, total: items.length });
    },

    listMine() {
      const currentUser = _getCurrentUser();
      if (!currentUser) {
        return _mockError('Não autenticado', 401);
      }

      const items = _getItems().filter(item => item.donor_id === currentUser.id);
      return _mockResponse({ items });
    },

    getById(id) {
      const items = _getItems();
      const item = items.find(i => i.id == id);
      
      if (!item) {
        return _mockError('Item não encontrado', 404);
      }

      return _mockResponse({ item });
    },

    getByCategory(category) {
      const items = _getItems().filter(item => 
        item.category === category && item.status === 'disponivel'
      );
      return _mockResponse({ items });
    },

    getWhatsAppContact(id) {
      const item = _getItems().find(i => i.id == id);
      if (!item) {
        return _mockError('Item não encontrado', 404);
      }

      return _mockResponse({ 
        phone: item.donor?.phone || '(21) 99999-9999',
        message: `Olá! Vi seu item "${item.title}" no DoaFácil e tenho interesse.`
      });
    },

    create(data) {
      const currentUser = _getCurrentUser();
      if (!currentUser) {
        return _mockError('Não autenticado', 401);
      }

      const items = _getItems();
      const newItem = {
        id: Date.now(),
        ...data,
        donor_id: currentUser.id,
        donor: {
          name: currentUser.name,
          location: currentUser.bairro || currentUser.address,
          verified: currentUser.verified
        },
        status: 'disponivel',
        created_at: new Date().toISOString()
      };

      items.push(newItem);
      _saveItems(items);

      return _mockResponse({ item: newItem });
    },

    createWithImages(formData) {
      const currentUser = _getCurrentUser();
      if (!currentUser) {
        return _mockError('Não autenticado', 401);
      }

      const items = _getItems();
      const newItem = {
        id: Date.now(),
        title: 'Novo Item',
        category: 'outros',
        condition: 'bom',
        description: 'Item adicionado',
        images: ['./assets/img/items/item1.jpg'],
        donor_id: currentUser.id,
        donor: {
          name: currentUser.name,
          location: currentUser.bairro || currentUser.address,
          verified: currentUser.verified
        },
        status: 'disponivel',
        created_at: new Date().toISOString()
      };

      items.push(newItem);
      _saveItems(items);

      return _mockResponse({ item: newItem });
    },

    update(id, data) {
      const currentUser = _getCurrentUser();
      if (!currentUser) {
        return _mockError('Não autenticado', 401);
      }

      const items = _getItems();
      const index = items.findIndex(i => i.id == id);

      if (index === -1) {
        return _mockError('Item não encontrado', 404);
      }

      if (items[index].donor_id !== currentUser.id) {
        return _mockError('Sem permissão', 403);
      }

      items[index] = { ...items[index], ...data };
      _saveItems(items);

      return _mockResponse({ item: items[index] });
    },

    updateWithImages(id, formData) {
      return this.update(id, {});
    },

    delete(id) {
      const currentUser = _getCurrentUser();
      if (!currentUser) {
        return _mockError('Não autenticado', 401);
      }

      const items = _getItems();
      const index = items.findIndex(i => i.id == id);

      if (index === -1) {
        return _mockError('Item não encontrado', 404);
      }

      if (items[index].donor_id !== currentUser.id) {
        return _mockError('Sem permissão', 403);
      }

      items.splice(index, 1);
      _saveItems(items);

      return _mockResponse({ message: 'Item excluído' });
    },
  };

  // ── Reservas ────────────────────────────────────────────────
  const Reservations = {
    create(itemId, message = '') {
      const currentUser = _getCurrentUser();
      if (!currentUser) {
        return _mockError('Não autenticado', 401);
      }

      const items = _getItems();
      const item = items.find(i => i.id == itemId);

      if (!item) {
        return _mockError('Item não encontrado', 404);
      }

      if (item.status !== 'disponivel') {
        return _mockError('Item não está disponível', 400);
      }

      const reservations = _getReservations();
      const newReservation = {
        id: Date.now(),
        item_id: item.id,
        item,
        user_id: currentUser.id,
        receiver: currentUser,
        donor_id: item.donor_id,
        donor: item.donor,
        message,
        status: 'pendente',
        created_at: new Date().toISOString()
      };

      reservations.push(newReservation);
      _saveReservations(reservations);

      const itemIndex = items.findIndex(i => i.id == itemId);
      items[itemIndex].status = 'reservado';
      _saveItems(items);

      return _mockResponse({ reservation: newReservation });
    },

    getReceived() {
      const currentUser = _getCurrentUser();
      if (!currentUser) {
        return _mockError('Não autenticado', 401);
      }

      const reservations = _getReservations().filter(r => r.user_id === currentUser.id);
      return _mockResponse({ reservations });
    },

    getDonated() {
      const currentUser = _getCurrentUser();
      if (!currentUser) {
        return _mockError('Não autenticado', 401);
      }

      const reservations = _getReservations().filter(r => r.donor_id === currentUser.id);
      return _mockResponse({ reservations });
    },

    getById(id) {
      const reservation = _getReservations().find(r => r.id == id);
      if (!reservation) {
        return _mockError('Reserva não encontrada', 404);
      }
      return _mockResponse({ reservation });
    },

    complete(id) {
      const currentUser = _getCurrentUser();
      if (!currentUser) {
        return _mockError('Não autenticado', 401);
      }

      const reservations = _getReservations();
      const index = reservations.findIndex(r => r.id == id);

      if (index === -1) {
        return _mockError('Reserva não encontrada', 404);
      }

      reservations[index].status = 'concluida';
      _saveReservations(reservations);

      const items = _getItems();
      const itemIndex = items.findIndex(i => i.id == reservations[index].item_id);
      if (itemIndex !== -1) {
        items[itemIndex].status = 'doado';
        _saveItems(items);
      }

      return _mockResponse({ reservation: reservations[index] });
    },

    cancel(id) {
      const currentUser = _getCurrentUser();
      if (!currentUser) {
        return _mockError('Não autenticado', 401);
      }

      const reservations = _getReservations();
      const index = reservations.findIndex(r => r.id == id);

      if (index === -1) {
        return _mockError('Reserva não encontrada', 404);
      }

      reservations[index].status = 'cancelada';
      _saveReservations(reservations);

      const items = _getItems();
      const itemIndex = items.findIndex(i => i.id == reservations[index].item_id);
      if (itemIndex !== -1) {
        items[itemIndex].status = 'disponivel';
        _saveItems(items);
      }

      return _mockResponse({ reservation: reservations[index] });
    },

    updateStatus(id, status) {
      const reservations = _getReservations();
      const index = reservations.findIndex(r => r.id == id);

      if (index === -1) {
        return _mockError('Reserva não encontrada', 404);
      }

      reservations[index].status = status;
      _saveReservations(reservations);

      return _mockResponse({ reservation: reservations[index] });
    },
  };

  // ── Histórico ───────────────────────────────────────────────
  const History = {
    getMine() {
      const currentUser = _getCurrentUser();
      if (!currentUser) {
        return _mockError('Não autenticado', 401);
      }

      const reservations = _getReservations().filter(r =>
        (r.user_id === currentUser.id || r.donor_id === currentUser.id) &&
        r.status === 'concluida'
      );

      return _mockResponse({ history: reservations });
    },
  };

  return { Auth, Users, Items, Reservations, History };
})();

window.DoaFacilAPI = DoaFacilAPI;


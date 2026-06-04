function initModal() {
  const ITEM_DESCRIPTION_MAX_LENGTH = 1000;
  const doarBtn = document.getElementById('doarBtn');
  const doarModal = document.getElementById('doarModal');
  const modalClose = doarModal ? doarModal.querySelector('.modal-close') : null;
  const formDoacao = document.getElementById('formDoacao');

  if (!doarBtn || !doarModal || !modalClose || !formDoacao) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initModal, { once: true });
    } else {
      setTimeout(initModal, 100);
    }
    return;
  }

  if (doarBtn.dataset.modalAttached === 'true') {
    return;
  }
  doarBtn.dataset.modalAttached = 'true';

  function isLoggedIn() {
    return !!localStorage.getItem('doafacil_token');
  }

  function getLoginPath() {
    return window.location.pathname.includes('/pages/') ? './login.html' : './pages/login.html';
  }

  function openDonationModal() {
    if (!isLoggedIn()) {
      window.location.href = getLoginPath();
      return;
    }

    doarModal.classList.add('active');
  }

  function updateCharCounter(field) {
    const counter = document.querySelector(`[data-counter-for="${field.id}"]`);
    if (!counter) return;

    counter.textContent = `${field.value.length}/${field.maxLength} caracteres`;
  }

  const descriptionField = document.getElementById('itemDescricao');
  if (descriptionField) {
    descriptionField.maxLength = ITEM_DESCRIPTION_MAX_LENGTH;
    updateCharCounter(descriptionField);
    descriptionField.addEventListener('input', () => updateCharCounter(descriptionField));
  }

  doarBtn.addEventListener('click', openDonationModal);

  modalClose.addEventListener('click', () => {
    doarModal.classList.remove('active');
  });

  window.addEventListener('click', (e) => {
    if (e.target === doarModal) {
      doarModal.classList.remove('active');
    }
  });

  formDoacao.addEventListener('submit', (e) => {
    e.preventDefault();

    const images = Array.from(document.getElementById('itemImages').files);
    if (images.length > 3) {
      alert('Por favor, selecione no máximo 3 imagens.');
      return;
    }

    const description = document.getElementById('itemDescricao').value.trim();

    if (description.length > ITEM_DESCRIPTION_MAX_LENGTH) {
      alert(`A descrição deve ter no máximo ${ITEM_DESCRIPTION_MAX_LENGTH} caracteres.`);
      return;
    }

    const formData = {
      nome: document.getElementById('itemNome').value,
      categoria: document.getElementById('itemCategoria').value,
      imagens: images.map(file => file.name),
      descricao: description,
      condicao: document.getElementById('itemCondicao').value,
      dimensoes: document.getElementById('itemDimensoes').value,
      material: document.getElementById('itemMaterial').value,
      cor: document.getElementById('itemCor').value,
      retirada: document.getElementById('itemRetirada').value,
      rua: document.getElementById('itemRua').value,
      numero: document.getElementById('itemNumero').value,
      bairro: document.getElementById('itemBairro').value,
      cidade: document.getElementById('itemCidade').value,
    };

    const apiPayload = {
      title: formData.nome,
      description: formData.descricao,
      category: formData.categoria,
      condition: formData.condicao,
      location: `${formData.bairro}, ${formData.cidade}`,
      images: formData.imagens,
      dimensions: formData.dimensoes,
      material: formData.material,
      color: formData.cor,
      pickup: formData.retirada,
      address: {
        street: formData.rua,
        number: formData.numero,
        neighborhood: formData.bairro,
        city: formData.cidade
      }
    };

    if (window.DoaFacilAPI?.Items?.create) {
      if (!DoaFacilAPI.Auth.isLoggedIn()) {
        alert('Para cadastrar um item na API, entre na sua conta primeiro.');
        return;
      }

      const request = images.length && DoaFacilAPI.Items.createWithImages
        ? DoaFacilAPI.Items.createWithImages(buildItemFormData(apiPayload, images))
        : DoaFacilAPI.Items.create(apiPayload);

      request
        .done(() => {
          formDoacao.reset();
          if (descriptionField) updateCharCounter(descriptionField);
          doarModal.classList.remove('active');
          alert('Item cadastrado com sucesso!');
        })
        .fail((jqXHR) => {
          if (jqXHR.status === 401) return;
          alert(jqXHR.responseJSON?.error || 'NÃ£o foi possÃ­vel cadastrar o item.');
        });
      return;
    }

    console.log('Item cadastrado:', formData);
    formDoacao.reset();
    doarModal.classList.remove('active');
    alert('Item cadastrado com sucesso!');
  });

  function buildItemFormData(apiPayload, images) {
    const formData = new FormData();

    Object.entries(apiPayload).forEach(([key, value]) => {
      if (key === 'images') return;
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
    });

    images.forEach((image) => {
      formData.append('images', image);
    });

    return formData;
  }
}

function initItemEditor() {
  if (window.DoaFacilItemEditor) {
    return;
  }

  const ITEM_DESCRIPTION_MAX_LENGTH = 1000;
  let currentItemId = null;
  let currentOptions = {};

  function isLoggedIn() {
    return !!localStorage.getItem('doafacil_token');
  }

  function getLoginPath() {
    return window.location.pathname.includes('/pages/') ? './login.html' : './pages/login.html';
  }

  function ensureEditModal() {
    let modal = document.getElementById('editItemModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'editItemModal';
    modal.className = 'modal custom-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Editar item</h2>
          <button type="button" class="modal-close" aria-label="Fechar">&times;</button>
        </div>
        <div class="modal-description">
          <p>Atualize as informacoes do item para manter a doacao correta.</p>
        </div>
        <form id="editItemForm" class="modal-form">
          <div class="form-group">
            <label for="editItemNome">Nome do Item *</label>
            <input type="text" id="editItemNome" name="nome" required>
          </div>
          <div class="form-group">
            <label for="editItemCategoria">Categoria *</label>
            <select id="editItemCategoria" name="categoria" required>
              <option value="">Selecione uma categoria</option>
              <option value="moveis">Moveis</option>
              <option value="eletro">Eletro</option>
              <option value="roupas">Roupas</option>
              <option value="calcados">Calcados</option>
              <option value="escolar">Escolar</option>
              <option value="utensilios">Utensilios</option>
              <option value="brinquedos">Brinquedos</option>
              <option value="outros">Outros</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editItemImages">Fotos do item</label>
            <input type="file" id="editItemImages" name="images" accept="image/*" multiple>
            <small style="display:block;margin-top:.35rem;color:var(--text-muted);font-size:.82rem;">Selecione novas imagens somente se quiser substituir as atuais. Maximo 3 imagens.</small>
          </div>
          <div class="form-group">
            <label for="editItemDescricao">Descricao</label>
            <textarea id="editItemDescricao" name="descricao" rows="4" maxlength="1000" placeholder="Descreva o estado, caracteristicas e detalhes do item..."></textarea>
            <small class="char-counter" data-counter-for="editItemDescricao">0/1000 caracteres</small>
          </div>
          <div class="form-group">
            <label for="editItemCondicao">Condicao *</label>
            <select id="editItemCondicao" name="condicao" required>
              <option value="">Selecione a condicao</option>
              <option value="otimo">Otimo</option>
              <option value="bom">Bom</option>
              <option value="usado">Usado</option>
            </select>
          </div>
          <div class="form-group">
            <label for="editItemDimensoes">Dimensoes</label>
            <input type="text" id="editItemDimensoes" name="dimensoes" placeholder="Ex: 220 x 85 x 90 cm">
          </div>
          <div class="form-group">
            <label for="editItemMaterial">Material</label>
            <input type="text" id="editItemMaterial" name="material" placeholder="Ex: Madeira / Tecido">
          </div>
          <div class="form-group">
            <label for="editItemCor">Cor</label>
            <input type="text" id="editItemCor" name="cor" placeholder="Ex: Cinza claro">
          </div>
          <div class="form-group">
            <label for="editItemRetirada">Retirada</label>
            <input type="text" id="editItemRetirada" name="retirada" placeholder="Ex: A combinar, Retirar no local">
          </div>
          <div class="form-group">
            <label for="editItemRua">Rua *</label>
            <input type="text" id="editItemRua" name="rua" placeholder="Nome da rua" required>
          </div>
          <div class="form-group">
            <label for="editItemNumero">Numero *</label>
            <input type="text" id="editItemNumero" name="numero" placeholder="Numero" required>
          </div>
          <div class="form-group">
            <label for="editItemBairro">Bairro *</label>
            <input type="text" id="editItemBairro" name="bairro" placeholder="Bairro" required>
          </div>
          <div class="form-group">
            <label for="editItemCidade">Cidade *</label>
            <input type="text" id="editItemCidade" name="cidade" placeholder="Cidade" required>
          </div>
          <button type="submit" class="btn-submit">Salvar alteracoes</button>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', closeEditModal);
    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeEditModal();
      }
    });

    const descriptionField = modal.querySelector('#editItemDescricao');
    descriptionField.maxLength = ITEM_DESCRIPTION_MAX_LENGTH;
    descriptionField.addEventListener('input', () => updateEditCounter(descriptionField));

    modal.querySelector('#editItemForm').addEventListener('submit', submitEditItem);

    return modal;
  }

  function updateEditCounter(field) {
    const counter = document.querySelector(`[data-counter-for="${field.id}"]`);
    if (!counter) return;
    counter.textContent = `${field.value.length}/${field.maxLength} caracteres`;
  }

  function openEditModal() {
    ensureEditModal().classList.add('active');
  }

  function closeEditModal() {
    const modal = document.getElementById('editItemModal');
    if (modal) modal.classList.remove('active');
  }

  function splitLocation(location) {
    const parts = String(location || '').split(',').map((part) => part.trim()).filter(Boolean);
    return {
      neighborhood: parts[0] || '',
      city: parts.slice(1).join(', ') || ''
    };
  }

  function fillEditForm(item) {
    const modal = ensureEditModal();
    const address = item.address || {};
    const locationParts = splitLocation(item.location);

    modal.querySelector('#editItemNome').value = item.title || '';
    modal.querySelector('#editItemCategoria').value = item.category || '';
    modal.querySelector('#editItemDescricao').value = item.description || item.desc || '';
    modal.querySelector('#editItemCondicao').value = item.condition || '';
    modal.querySelector('#editItemDimensoes').value = item.dimensions || '';
    modal.querySelector('#editItemMaterial').value = item.material || '';
    modal.querySelector('#editItemCor').value = item.color || '';
    modal.querySelector('#editItemRetirada').value = item.pickup || '';
    modal.querySelector('#editItemRua').value = address.street || '';
    modal.querySelector('#editItemNumero').value = address.number || '';
    modal.querySelector('#editItemBairro').value = address.neighborhood || locationParts.neighborhood;
    modal.querySelector('#editItemCidade').value = address.city || locationParts.city;
    modal.querySelector('#editItemImages').value = '';

    updateEditCounter(modal.querySelector('#editItemDescricao'));
  }

  function readEditPayload() {
    const bairro = document.getElementById('editItemBairro').value.trim();
    const cidade = document.getElementById('editItemCidade').value.trim();

    return {
      title: document.getElementById('editItemNome').value.trim(),
      category: document.getElementById('editItemCategoria').value,
      description: document.getElementById('editItemDescricao').value.trim(),
      condition: document.getElementById('editItemCondicao').value,
      location: [bairro, cidade].filter(Boolean).join(', '),
      dimensions: document.getElementById('editItemDimensoes').value.trim(),
      material: document.getElementById('editItemMaterial').value.trim(),
      color: document.getElementById('editItemCor').value.trim(),
      pickup: document.getElementById('editItemRetirada').value.trim(),
      address: {
        street: document.getElementById('editItemRua').value.trim(),
        number: document.getElementById('editItemNumero').value.trim(),
        neighborhood: bairro,
        city: cidade
      }
    };
  }

  function buildEditFormData(apiPayload, images) {
    const formData = new FormData();

    Object.entries(apiPayload).forEach(([key, value]) => {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
    });

    images.forEach((image) => {
      formData.append('images', image);
    });

    return formData;
  }

  function submitEditItem(event) {
    event.preventDefault();

    if (!currentItemId) {
      alert('Item nao encontrado para edicao.');
      return;
    }

    const images = Array.from(document.getElementById('editItemImages').files);
    if (images.length > 3) {
      alert('Por favor, selecione no maximo 3 imagens.');
      return;
    }

    const payload = readEditPayload();
    if (payload.description.length > ITEM_DESCRIPTION_MAX_LENGTH) {
      alert(`A descricao deve ter no maximo ${ITEM_DESCRIPTION_MAX_LENGTH} caracteres.`);
      return;
    }

    if (!window.DoaFacilAPI?.Items?.update) {
      alert('API indisponivel para editar item.');
      return;
    }

    const submitButton = document.querySelector('#editItemForm .btn-submit');
    submitButton.disabled = true;
    submitButton.textContent = 'Salvando...';

    const request = images.length && DoaFacilAPI.Items.updateWithImages
      ? DoaFacilAPI.Items.updateWithImages(currentItemId, buildEditFormData(payload, images))
      : DoaFacilAPI.Items.update(currentItemId, payload);

    request
      .done((response) => {
        const updatedItem = response.item || response;
        closeEditModal();
        alert('Item atualizado com sucesso!');

        if (typeof currentOptions.onSaved === 'function') {
          currentOptions.onSaved(updatedItem);
        }

        window.dispatchEvent(new CustomEvent('doafacil:item-updated', {
          detail: { item: updatedItem }
        }));
      })
      .fail((jqXHR) => {
        if (jqXHR.status === 401) return;
        alert(jqXHR.responseJSON?.error || 'Nao foi possivel atualizar o item.');
      })
      .always(() => {
        submitButton.disabled = false;
        submitButton.textContent = 'Salvar alteracoes';
      });
  }

  function open(itemOrId, options = {}) {
    if (!isLoggedIn()) {
      window.location.href = getLoginPath();
      return;
    }

    currentOptions = options;
    const modal = ensureEditModal();

    if (typeof itemOrId === 'object' && itemOrId !== null) {
      currentItemId = itemOrId.id;
      fillEditForm(itemOrId);
      openEditModal();
      return;
    }

    currentItemId = Number(itemOrId);
    if (!Number.isFinite(currentItemId) || currentItemId <= 0) {
      alert('Item nao encontrado para edicao.');
      return;
    }

    modal.querySelector('#editItemForm').reset();
    modal.querySelector('.modal-description p').textContent = 'Carregando dados do item...';
    openEditModal();

    DoaFacilAPI.Items.getById(currentItemId)
      .done((item) => {
        modal.querySelector('.modal-description p').textContent = 'Atualize as informacoes do item para manter a doacao correta.';
        fillEditForm(item);
      })
      .fail((jqXHR) => {
        if (jqXHR.status === 401) return;
        closeEditModal();
        alert(jqXHR.responseJSON?.error || 'Nao foi possivel carregar o item para edicao.');
      });
  }

  window.DoaFacilItemEditor = {
    open,
    close: closeEditModal
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initModal();
    initItemEditor();
  });
} else {
  initModal();
  initItemEditor();
}

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

      DoaFacilAPI.Items.create(apiPayload)
        .done(() => {
          formDoacao.reset();
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModal);
} else {
  initModal();
}

function initModal() {
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

  doarBtn.addEventListener('click', () => {
    doarModal.classList.add('active');
  });

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

    const formData = {
      nome: document.getElementById('itemNome').value,
      categoria: document.getElementById('itemCategoria').value,
      descricao: document.getElementById('itemDescricao').value,
      condicao: document.getElementById('itemCondicao').value,
      localizacao: document.getElementById('itemLocalizacao').value,
    };

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

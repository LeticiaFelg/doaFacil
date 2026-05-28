// Aguardar carregamento do navbar
function initModal() {
  const doarBtn = document.getElementById('doarBtn');
  const doarModal = document.getElementById('doarModal');
  const modalClose = document.querySelector('.modal-close');
  const formDoacao = document.getElementById('formDoacao');

  if (!doarBtn) {
    // Navbar ainda não foi carregado, tentar novamente
    setTimeout(initModal, 100);
    return;
  }

  // Abrir modal quando clicar no botão
  doarBtn.addEventListener('click', () => {
    doarModal.classList.add('active');
  });

  // Fechar modal quando clicar no X
  modalClose.addEventListener('click', () => {
    doarModal.classList.remove('active');
  });

  // Fechar modal quando clicar fora dela
  window.addEventListener('click', (e) => {
    if (e.target === doarModal) {
      doarModal.classList.remove('active');
    }
  });

  // Submeter formulário
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
    
    // Aqui você pode enviar os dados para um servidor
    // ou adicionar o item à página dinamicamente
    
    // Limpar formulário e fechar modal
    formDoacao.reset();
    doarModal.classList.remove('active');
    alert('Item cadastrado com sucesso!');
  });
}

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initModal);

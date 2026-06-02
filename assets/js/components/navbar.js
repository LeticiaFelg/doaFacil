const navbarPath = window.location.pathname.includes('/pages/') ? '../assets/components/navbar.html' : './assets/components/navbar.html';
const authReady = window.DoaFacilHomeAuthReady || Promise.resolve();

authReady
  .then(() => $.get(navbarPath))
  .then(data => {
    $('#navbar').html(data);

    function getCurrentUser() {
      return JSON.parse(localStorage.getItem('doafacil_current_user') || 'null');
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
      const avatar = document.querySelector('.nav-avatar');
      if (avatar) {
        const initials = currentUser.name.split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase();
        avatar.textContent = initials || '👤';
        avatar.title = currentUser.name;
      }
    }

    // Detecta página atual
    const currentPage = window.location.pathname.split("/").pop();

    // Todos os links da navbar
    const links = document.querySelectorAll('.nav-link-btn');

    links.forEach(link => {

      const href = link.getAttribute('href');

      // Pega apenas o nome do arquivo
      const pageName = href.split("/").pop();

      // Remove active de todos
      link.classList.remove('active');

      // Adiciona active na página atual
      if (pageName === currentPage) {
        link.classList.add('active');
      }

    });

  });

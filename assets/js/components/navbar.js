const navbarPath = window.location.pathname.includes('/pages/') ? '../assets/components/navbar.html' : './assets/components/navbar.html';
const authReady = window.DoaFacilHomeAuthReady || Promise.resolve();

authReady
  .then(() => $.get(navbarPath))
  .then(data => {
    $('#navbar').html(data);

    const isPagesPath = window.location.pathname.includes('/pages/');
    const assetsPath = isPagesPath ? '../assets' : './assets';
    $('.brand-logo').attr('src', `${assetsPath}/img/Logo.webp`);

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

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navRoutes = {
      home: isPagesPath ? '../index.html' : 'index.html',
      perfil: isPagesPath ? 'perfil.html' : 'pages/perfil.html',
      historico: isPagesPath ? 'historico.html' : 'pages/historico.html'
    };

    $('[data-nav-target]').each(function () {
      const $link = $(this);
      const target = $link.data('nav-target');
      const href = navRoutes[target];

      if (!href) return;

      $link.attr('href', href);
      $link.removeClass('active');

      if (href.split('/').pop() === currentPage) {
        $link.addClass('active');
      }
    });

    const infoModalsScriptPath = window.location.pathname.includes('/pages/')
      ? '../assets/js/components/info-modals.js'
      : './assets/js/components/info-modals.js';

    if (!window.DoaFacilInfoModalsLoading) {
      window.DoaFacilInfoModalsLoading = true;
      $.getScript(infoModalsScriptPath);
    }

  });

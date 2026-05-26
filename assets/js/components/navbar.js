fetch('../assets/components/navbar.html')
  .then(response => response.text())
  .then(data => {

    document.getElementById('navbar').innerHTML = data;

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
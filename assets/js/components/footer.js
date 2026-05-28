const footerPath = window.location.pathname.includes('/pages/') ? '../assets/components/footer.html' : './assets/components/footer.html';

fetch(footerPath)
  .then(response => response.text())
  .then(data => {

    document.getElementById('footer').innerHTML = data;

  });
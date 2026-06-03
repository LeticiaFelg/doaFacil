function initInfoModals() {
  const componentPath = window.location.pathname.includes('/pages/')
    ? '../assets/components/info-modals.html'
    : './assets/components/info-modals.html';

  if ($('#infoModalsMount').length) return;

  $('body').append('<div id="infoModalsMount"></div>');

  $('#infoModalsMount').load(componentPath, function () {
    function closeInfoModal() {
      $('#infoModalOverlay').removeClass('active').attr('aria-hidden', 'true');
      $('.info-modal-panel').removeClass('active');
      $('.faq-question').removeClass('active');
      $('.faq-answer').slideUp(120);
    }

    function openInfoModal(modalName) {
      const $panel = $(`.info-modal-panel[data-info-panel="${modalName}"]`);
      if (!$panel.length) return;

      $('.info-modal-panel').removeClass('active');
      $panel.addClass('active');
      $('#infoModalOverlay').addClass('active').attr('aria-hidden', 'false');
    }

    $(document).on('click', '[data-info-modal]', function (event) {
      event.preventDefault();
      const modalName = $(this).data('info-modal');
      const offcanvasEl = document.getElementById('navOffcanvas');
      const offcanvas = offcanvasEl && bootstrap.Offcanvas.getInstance(offcanvasEl);

      if (offcanvas) {
        offcanvas.hide();
      }

      openInfoModal(modalName);
    });

    $(document).on('click', '.info-modal-close', closeInfoModal);

    $(document).on('click', '#infoModalOverlay', function (event) {
      if (event.target === this) {
        closeInfoModal();
      }
    });

    $(document).on('keydown', function (event) {
      if (event.key === 'Escape' && $('#infoModalOverlay').hasClass('active')) {
        closeInfoModal();
      }
    });

    $(document).on('click', '.faq-question', function () {
      const $question = $(this);
      const $answer = $question.next('.faq-answer');
      const isOpen = $question.hasClass('active');

      $('.faq-question').removeClass('active');
      $('.faq-answer').slideUp(120);

      if (!isOpen) {
        $question.addClass('active');
        $answer.slideDown(120);
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initInfoModals);
} else {
  initInfoModals();
}

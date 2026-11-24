/* LE GOÛT DU MOMENT — interactions (JavaScript natif, aucune dépendance).
   const / let uniquement (aucun var). */
(function () {
  'use strict';

  const SITE_NAME = 'LE GOÛT DU MOMENT';

  /* ---------- Menu latéral (mobile) ---------- */
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawer-overlay');
  const closeBtn = document.getElementById('drawer-close');
  let closeTimer = 0;

  function setMenu(open) {
    clearTimeout(closeTimer);
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    if (open) {
      drawer.hidden = false;
      overlay.hidden = false;
      requestAnimationFrame(function () {
        drawer.classList.add('is-open');
        overlay.classList.add('is-open');
      });
      closeBtn.focus();
    } else {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      closeTimer = setTimeout(function () { drawer.hidden = true; overlay.hidden = true; }, 350);
    }
  }
  burger.addEventListener('click', function () { setMenu(true); });
  closeBtn.addEventListener('click', function () { setMenu(false); burger.focus(); });
  overlay.addEventListener('click', function () { setMenu(false); });
  drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') { setMenu(false); burger.focus(); }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) { if (mq.matches) setMenu(false); });

  /* ---------- Apparition au scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal, .stagger');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });
    revealEls.forEach(function (el) { revealObs.observe(el); });

    // Catégories de la carte (menu.html) : pastille active + défilement horizontal
    const catLinks = document.querySelectorAll('.cat-nav__link');
    if (catLinks.length) {
      const catObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          catLinks.forEach(function (l) {
            const active = l.getAttribute('href') === '#' + entry.target.id;
            l.classList.toggle('is-active', active);
            if (active) l.parentElement.parentElement.scrollTo({ left: l.offsetLeft - 16, behavior: 'smooth' });
          });
        });
      }, { rootMargin: '-30% 0px -60% 0px' });
      document.querySelectorAll('.carte__cat').forEach(function (s) { catObs.observe(s); });
    }
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Carte Google Maps chargée au clic seulement (économise ~1 Mo) ---------- */
  const mapBtn = document.getElementById('map-btn');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      const box = document.getElementById('map');
      const iframe = document.createElement('iframe');
      iframe.src = box.dataset.src;
      iframe.title = 'Carte : ' + SITE_NAME;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      box.innerHTML = '';
      box.appendChild(iframe);
    });
  }

})();

/* RESTAURANT LE CAVIAR — interactions (vanilla JS, aucune dépendance) */
(function () {
  'use strict';

  const WHATSAPP_NUMBER = '2290100000000'; // +229 01 00 00 00 00
  // Alertes affichées en tête des demandes de réservation WhatsApp
  const ALERT_VIP = '*🚨 DEMANDE DE RÉSERVATION : ESPACE VIP / ROOFTOP 👑*';
  const ALERT_STANDARD = '*📩 DEMANDE DE RÉSERVATION : TABLE STANDARD 🍽️*';
  const DEFAULT_MESSAGE = 'Bonjour RESTAURANT LE CAVIAR 👋, je souhaite réserver une table. ' +
    'Pouvez-vous me confirmer vos disponibilités ? Merci !';

  function waLink(message) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  }

  document.documentElement.classList.add('js');

  /* ---------- Liens WhatsApp → message pré-rempli (data-message pour un texte spécifique) ---------- */
  document.querySelectorAll('.js-whatsapp').forEach(function (el) {
    el.href = waLink(el.dataset.message || DEFAULT_MESSAGE);
  });

  /* ---------- Header au scroll ---------- */
  const header = document.getElementById('header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 20); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Menu burger ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    nav.classList.toggle('is-open', open);
    header.classList.toggle('is-open', open);
    document.body.classList.toggle('no-scroll', open);
  }
  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---------- Filtres du menu ---------- */
  const tabs = document.querySelectorAll('.tab');
  const dishes = document.querySelectorAll('.dish');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const filter = tab.dataset.filter;
      tabs.forEach(function (t) {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', String(active));
      });
      dishes.forEach(function (d) {
        const show = filter === 'all' || d.dataset.cat === filter;
        d.classList.toggle('is-hidden', !show);
        if (show) d.classList.add('is-visible');
      });
    });
  });

  /* ---------- Apparition au scroll + lien actif ---------- */
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(function (el) { revealObs.observe(el); });

    // Seuls les liens d'ancre de la page courante suivent le défilement
    const links = document.querySelectorAll('.nav__link[href^="#"]');
    const navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { navObs.observe(s); });

    // Catégories de la carte (menu.html) : pastille active + défilement horizontal
    const catLinks = document.querySelectorAll('.cat-nav__link');
    if (catLinks.length) {
      const catObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          catLinks.forEach(function (l) {
            const active = l.getAttribute('href') === '#' + entry.target.id;
            l.classList.toggle('is-active', active);
            if (active) l.scrollIntoView({ block: 'nearest', inline: 'center' });
          });
        });
      }, { rootMargin: '-30% 0px -60% 0px' });
      document.querySelectorAll('.carte__cat').forEach(function (s) { catObs.observe(s); });
    }
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Année du footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Formulaire de réservation → WhatsApp (reservation.html) ---------- */
  const form = document.getElementById('form-reservation');
  if (!form) return;
  const errorBox = document.getElementById('form-error');
  const evenementField = document.getElementById('evenement-field');
  const evenementInput = document.getElementById('evenement');

  // Type de réservation : le champ « Événement » n'apparaît que pour l'espace VIP / Rooftop
  function isVip() {
    return form.querySelector('input[name="type-reservation"]:checked').value === 'vip';
  }
  form.addEventListener('change', function (e) {
    if (e.target.name === 'type-reservation') evenementField.hidden = !isVip();
  });
  const dateInput = document.getElementById('date');
  const heureInput = document.getElementById('heure');

  // Date minimale = aujourd'hui (heure locale)
  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  dateInput.min = today;
  dateInput.value = today;

  function parseDate(iso) {
    const p = iso.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function formatDate(iso) {
    return parseDate(iso).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Horaires : 7j/7 de 11h00 à 01h00 du matin (le service déborde sur le lendemain)
  const OPEN = '11:00';
  const CLOSE = '01:00';
  function afterMidnight(h) { return h <= CLOSE; }

  function hoursError() {
    const h = heureInput.value;
    if (!h || !dateInput.value) return '';
    if (h < OPEN && !afterMidnight(h)) return 'Nous vous accueillons 7j/7 de 11h00 à 01h00 du matin.';
    if (dateInput.value === today && !afterMidnight(h)) {
      const n = new Date();
      const current = ('0' + n.getHours()).slice(-2) + ':' + ('0' + n.getMinutes()).slice(-2);
      if (h < current) return 'Cette heure est déjà passée, merci d\'en choisir une autre.';
    }
    return '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Récupération des valeurs
    const nom = document.getElementById('nom');
    const telephone = document.getElementById('telephone');
    const email = document.getElementById('email');
    const personnes = document.getElementById('personnes');
    const demandes = document.getElementById('demandes').value.trim() || 'Aucune';

    const required = [nom, telephone, email, dateInput, heureInput, personnes];
    const invalid = required.filter(function (input) {
      const bad = !input.value.trim() || !input.checkValidity();
      input.classList.toggle('is-invalid', bad);
      return bad;
    });

    const onlyTime = invalid.length === 1 && invalid[0] === heureInput && heureInput.value;
    const message = invalid.length && !onlyTime ? 'Merci de compléter correctement les champs en rouge.' : hoursError();
    if (!invalid.length && message) invalid.push(heureInput);
    heureInput.classList.toggle('is-invalid', invalid.indexOf(heureInput) !== -1);

    if (message) {
      errorBox.textContent = message;
      errorBox.hidden = false;
      invalid[0].focus();
      return;
    }
    errorBox.hidden = true;

    // Construction du message pour WhatsApp : l'alerte du type de réservation en tête
    const vip = isVip();
    const evenement = evenementInput.value.trim().replace(/\s*\n\s*/g, ', ');
    const textMessage = (vip ? ALERT_VIP : ALERT_STANDARD) + '\n\n' +
      'Bonjour RESTAURANT LE CAVIAR, je souhaite effectuer une réservation :\n' +
      '- *Espace :* ' + (vip ? 'Privé VIP / Rooftop (soumis à validation de la direction)' : 'Table standard (salle principale ou terrasse)') + '\n' +
      (vip ? '- *Événement :* ' + (evenement || 'Non précisé') + '\n' : '') +
      '- *Nom :* ' + nom.value.trim() + '\n' +
      '- *Téléphone :* ' + telephone.value.trim() + '\n' +
      '- *Email :* ' + email.value.trim() + '\n' +
      '- *Date :* ' + formatDate(dateInput.value) + '\n' +
      '- *Heure :* ' + heureInput.value.replace(':', 'h') + (afterMidnight(heureInput.value) ? ' (dans la nuit, après minuit)' : '') + '\n' +
      '- *Nombre de places :* ' + personnes.value + '\n' +
      '- *Demandes spéciales :* ' + demandes;

    // Redirection vers WhatsApp (repli sur la même page si la popup est bloquée)
    const url = waLink(textMessage);
    const win = window.open(url, '_blank');
    if (!win) window.location.href = url;
  });

  form.addEventListener('input', function (e) {
    if (e.target.classList.contains('is-invalid') && e.target.checkValidity() && e.target.value.trim()) {
      e.target.classList.remove('is-invalid');
    }
  });
})();

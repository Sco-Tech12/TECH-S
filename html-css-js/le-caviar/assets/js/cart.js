/* RESTAURANT LE CAVIAR — panier & commande en ligne (localStorage + WhatsApp) */
(function () {
  'use strict';

  const STORAGE_KEY = 'caviar_panier';       // clé unique, identique sur toutes les pages
  const STAMP_KEY = 'caviar_panier_maj';     // date de dernière modification
  const LEGACY_KEY = 'panier';              // ancienne clé, migrée automatiquement
  const NAME_PREFIX = 'caviar_panier:';
  const URL_PARAM = 'panier';
  const ORDER_PAGE = 'commander.html';
  const SITE_PAGES = /^((?:index|menu|reservation|commander|a-propos)\.html)(?:\?[^#]*)?(#.*)?$/;
  // Fichiers ouverts directement (file://) : selon le navigateur, chaque page a son propre
  // localStorage. Le panier voyage alors aussi dans les liens internes (?panier=…).
  // En ligne (http/https), toutes les pages partagent le même stockage : liens propres.
  const CARRY_IN_LINKS = location.protocol === 'file:';
  const WHATSAPP_NUMBER = '2290100000000'; // +229 01 00 00 00 00
  const MAX_QTY = 50;
  // Alertes affichées en tête des commandes sur place (type de réservation)
  const ALERT_VIP = '*🚨 DEMANDE DE RÉSERVATION : ESPACE VIP / ROOFTOP 👑*';
  const ALERT_STANDARD = '*📩 DEMANDE DE RÉSERVATION : TABLE STANDARD 🍽️*';
  const MODE_SUR_PLACE = 'Sur place';

  /* ---------- Stockage ----------
     Source principale : localStorage (clé 'caviar_panier'). Copies de secours : window.name
     (même onglet) et, en file://, le paramètre ?panier= des liens internes. Chaque copie porte
     sa date de modification : au chargement, la plus récente l'emporte — y compris un panier
     vidé, pour qu'une ancienne copie ne fasse jamais réapparaître des plats supprimés. */
  function sanitize(items) {
    if (!Array.isArray(items)) return [];
    return items
      .filter(function (i) { return i && typeof i.id === 'string' && +i.prix > 0 && +i.quantite >= 1; })
      .slice(0, 100)
      .map(function (i) {
        return {
          id: i.id.slice(0, 80),
          nom: String(i.nom || '').slice(0, 120),
          prix: Math.round(+i.prix),
          quantite: Math.min(Math.floor(+i.quantite), MAX_QTY),
          image: String(i.image || '').slice(0, 8),
          categorie: String(i.categorie || '').slice(0, 60),
          variable: !!i.variable
        };
      });
  }
  function readStorage(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function parseSnapshot(json) {
    try {
      const o = JSON.parse(json);
      return o && Array.isArray(o.items) ? { t: +o.t || 0, items: sanitize(o.items) } : null;
    } catch (e) {
      return null;
    }
  }

  function loadCart() {
    const copies = [];

    const stored = readStorage(STORAGE_KEY);
    const storedStamp = +readStorage(STAMP_KEY) || 0;
    const legacy = readStorage(LEGACY_KEY);
    try {
      if (stored !== null) copies.push({ t: storedStamp, items: sanitize(JSON.parse(stored)) });
      else if (storedStamp) copies.push({ t: storedStamp, items: [] }); // panier vidé à cette date
      else if (legacy !== null) copies.push({ t: 0, items: sanitize(JSON.parse(legacy)) });
    } catch (e) { /* valeur illisible : ignorée */ }

    if (window.name.indexOf(NAME_PREFIX) === 0) {
      const fromName = parseSnapshot(window.name.slice(NAME_PREFIX.length));
      if (fromName) copies.push(fromName);
    }

    if (CARRY_IN_LINKS) {
      const fromUrl = new URLSearchParams(location.search).get(URL_PARAM);
      if (fromUrl !== null) {
        const snap = parseSnapshot(fromUrl);
        if (snap) copies.push(snap);
        // Retire le panier de l'adresse affichée
        try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* file:// strict */ }
      }
    }

    if (!copies.length) return { t: 0, items: [] };
    return copies.reduce(function (best, c) { return c.t > best.t ? c : best; });
  }

  function snapshot() {
    return JSON.stringify({ t: stamp, items: cart });
  }
  function persist() {
    try {
      if (cart.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      } else {
        localStorage.removeItem(STORAGE_KEY); // panier vide : la clé est supprimée
      }
      localStorage.setItem(STAMP_KEY, String(stamp));
      localStorage.removeItem(LEGACY_KEY);
    } catch (e) { /* stockage bloqué : les copies de secours prennent le relais */ }
    // Toujours écrite, même vide : une copie vide et datée l'emporte sur une ancienne copie pleine
    window.name = NAME_PREFIX + snapshot();
    updateCartLinks();
  }
  function saveCart() {
    stamp = Date.now();
    persist();
    refresh();
  }

  function withCart(page, anchor) {
    return page + (CARRY_IN_LINKS ? '?' + URL_PARAM + '=' + encodeURIComponent(snapshot()) : '') + (anchor || '');
  }
  function cartUrl() {
    return withCart(ORDER_PAGE);
  }
  function updateCartLinks() {
    document.querySelectorAll('a[href]').forEach(function (a) {
      const m = a.getAttribute('href').match(SITE_PAGES);
      if (m) a.setAttribute('href', withCart(m[1], m[2]));
    });
  }

  let cart = [];
  let stamp = 0;

  function fcfa(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
  }
  function countItems() {
    return cart.reduce(function (s, i) { return s + i.quantite; }, 0);
  }
  function subtotal() {
    return cart.reduce(function (s, i) { return s + i.prix * i.quantite; }, 0);
  }
  function find(id) {
    for (let i = 0; i < cart.length; i++) if (cart[i].id === id) return cart[i];
    return null;
  }

  /* ---------- Badge du panier (toutes les pages) ---------- */
  function updateBadge() {
    const n = countItems();
    document.querySelectorAll('.cart-badge').forEach(function (b) {
      b.textContent = n > 99 ? '99+' : n;
      b.hidden = n === 0;
    });
    document.querySelectorAll('.cart-btn').forEach(function (a) {
      a.setAttribute('aria-label', n ? 'Mon panier, ' + n + ' article' + (n > 1 ? 's' : '') : 'Mon panier, vide');
    });
  }

  /* ---------- Notification ---------- */
  let toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '';
    const text = document.createElement('span');
    text.textContent = msg;
    const link = document.createElement('a');
    link.href = cartUrl();
    link.textContent = 'Voir le panier';
    toastEl.appendChild(text);
    toastEl.appendChild(link);
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 3200);
  }

  /* ---------- Ajouter au panier ---------- */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    const d = btn.dataset;
    const item = find(d.id);
    if (item) {
      item.quantite = Math.min(item.quantite + 1, MAX_QTY);
    } else {
      cart.push({ id: d.id, nom: d.nom, prix: +d.prix, quantite: 1, image: d.image, categorie: d.categorie || '', variable: d.variable === '1' });
    }
    saveCart();
    toast('✓ ' + d.nom + ' ajouté au panier');

    btn.classList.add('is-added');
    clearTimeout(btn._t);
    btn._t = setTimeout(function () { btn.classList.remove('is-added'); }, 900);
  });

  // Synchronise les onglets ouverts en parallèle
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY || e.key === STAMP_KEY) {
      const latest = loadCart();
      cart = latest.items;
      stamp = latest.t;
      updateCartLinks();
      refresh();
    }
  });

  /* ---------- Démarrage : lit le panier et affiche la page ---------- */
  let list = null;
  let renderPage = function () {};

  function refresh() {
    updateBadge();
    renderPage();
  }

  function start() {
    const latest = loadCart();
    cart = latest.items;
    stamp = latest.t;
    persist(); // recopie la version la plus récente partout (localStorage, window.name, liens)

    list = document.getElementById('cart-list');
    if (list) renderPage = initOrderPage();
    refresh();
  }
  if (document.readyState === 'complete') start();
  else document.addEventListener('DOMContentLoaded', start);

  // Retour arrière (page restaurée depuis le cache du navigateur) : relit la version la plus récente
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    const latest = loadCart();
    if (latest.t > stamp) { cart = latest.items; stamp = latest.t; }
    updateCartLinks();
    refresh();
  });

  /* ==========================================================================
     Page commander.html
     ========================================================================== */
  function initOrderPage() {
    const empty = document.getElementById('cart-empty');
    const done = document.getElementById('cart-done');
    const doneLink = document.getElementById('cart-done-link');
    const clearBtn = document.getElementById('cart-clear');
    const form = document.getElementById('form-commande');
    const submitBtn = document.getElementById('btn-commander');
    const errorBox = document.getElementById('order-error');
    const adresseField = document.getElementById('adresse-field');
    const adresse = document.getElementById('livraison-adresse');
    const pickupInfo = document.getElementById('pickup-info');
    const resaType = document.getElementById('commande-resa-type');
    const evenementField = document.getElementById('commande-evenement-field');
    const evenement = document.getElementById('commande-evenement');
    let sent = false;

    const TRASH = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4.5h6V7M6.5 7l1 13h9l1-13M10 11v5M14 11v5"/></svg>';

    function el(tag, cls, text) {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    }

    function renderItem(item) {
      const li = el('li', 'cart-item');
      li.dataset.id = item.id;

      li.appendChild(el('div', 'cart-item__img', item.image || '🍽️'));

      const info = el('div', 'cart-item__info');
      info.appendChild(el('h3', 'cart-item__name', item.nom));
      info.appendChild(el('p', 'cart-item__unit', (item.variable ? 'Dès ' : '') + fcfa(item.prix) + ' / unité'));
      li.appendChild(info);

      const qty = el('div', 'qty');
      const minus = el('button', 'qty__btn', '−');
      minus.type = 'button'; minus.dataset.action = 'dec';
      minus.setAttribute('aria-label', 'Diminuer la quantité de ' + item.nom);
      minus.disabled = item.quantite <= 1;
      const value = el('span', 'qty__value', item.quantite);
      value.setAttribute('aria-label', 'Quantité : ' + item.quantite);
      const plus = el('button', 'qty__btn', '+');
      plus.type = 'button'; plus.dataset.action = 'inc';
      plus.setAttribute('aria-label', 'Augmenter la quantité de ' + item.nom);
      plus.disabled = item.quantite >= MAX_QTY;
      qty.appendChild(minus); qty.appendChild(value); qty.appendChild(plus);
      li.appendChild(qty);

      li.appendChild(el('p', 'cart-item__total', fcfa(item.prix * item.quantite) + (item.variable ? ' *' : '')));

      const remove = el('button', 'cart-item__remove');
      remove.type = 'button'; remove.dataset.action = 'remove';
      remove.setAttribute('aria-label', 'Supprimer ' + item.nom + ' du panier');
      remove.innerHTML = TRASH;
      li.appendChild(remove);
      return li;
    }

    function render() {
      const has = cart.length > 0;
      list.innerHTML = '';
      cart.forEach(function (item) { list.appendChild(renderItem(item)); });

      if (has) sent = false;
      empty.hidden = has || sent;
      done.hidden = has || !sent;
      list.hidden = !has;
      clearBtn.hidden = !has;
      form.hidden = !has;
      submitBtn.disabled = !has;

      const total = fcfa(subtotal());
      const hasVariable = cart.some(function (i) { return i.variable; });
      document.getElementById('sum-count').textContent = countItems();
      document.getElementById('sum-subtotal').textContent = total + (hasVariable ? ' *' : '');
      document.getElementById('sum-total').textContent = total + (hasVariable ? ' *' : '');
      document.getElementById('sum-variable').hidden = !hasVariable;
      if (!has) errorBox.hidden = true;
    }

    // Quantités / suppression
    list.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const item = find(btn.closest('.cart-item').dataset.id);
      if (!item) return;
      const action = btn.dataset.action;
      if (action === 'inc') item.quantite = Math.min(item.quantite + 1, MAX_QTY);
      if (action === 'dec') item.quantite = Math.max(item.quantite - 1, 1);
      if (action === 'remove') cart = cart.filter(function (i) { return i.id !== item.id; });
      saveCart(); // localStorage + copies de secours, puis badge et totaux
      // Garde le focus sur le même bouton après le re-rendu
      const row = list.querySelector('[data-id="' + item.id + '"] [data-action="' + action + '"]');
      if (row && !row.disabled) row.focus();
    });

    clearBtn.addEventListener('click', function () {
      if (!window.confirm('Vider entièrement votre panier ?')) return;
      cart = [];
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* stockage bloqué */ }
      saveCart(); // date le panier vide partout (badge, totaux, copies de secours)
    });

    // Mode : livraison / à emporter
    function currentMode() {
      return form.querySelector('input[name="livraison-mode"]:checked').value;
    }
    function isVip() {
      return form.querySelector('input[name="type-reservation"]:checked').value === 'vip';
    }
    function syncMode() {
      const mode = currentMode();
      const delivery = mode === 'Livraison à domicile';
      const surPlace = mode === MODE_SUR_PLACE;
      adresseField.hidden = !delivery;
      adresse.required = delivery;
      pickupInfo.hidden = mode !== 'À emporter';
      resaType.hidden = !surPlace;
      evenementField.hidden = !(surPlace && isVip());
      document.getElementById('sum-delivery').textContent = delivery ? 'À définir' : surPlace ? 'Aucuns frais (sur place)' : 'Gratuit (retrait)';
    }
    form.addEventListener('change', function (e) {
      if (e.target.name === 'livraison-mode' || e.target.name === 'type-reservation') syncMode();
    });
    syncMode();

    form.addEventListener('input', function (e) {
      if (e.target.classList.contains('is-invalid') && e.target.checkValidity() && e.target.value.trim()) {
        e.target.classList.remove('is-invalid');
      }
    });

    // Validation & envoi WhatsApp
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      envoyerCommandeWhatsApp();
    });

    function envoyerCommandeWhatsApp() {
      if (!cart.length) {
        errorBox.textContent = 'Votre panier est vide.';
        errorBox.hidden = false;
        return;
      }

      const nom = document.getElementById('livraison-nom');
      const telephone = document.getElementById('livraison-tel');
      const mode = currentMode();
      const required = [nom, telephone];
      if (adresse.required) required.push(adresse);

      const invalid = required.filter(function (input) {
        const bad = !input.value.trim() || !input.checkValidity();
        input.classList.toggle('is-invalid', bad);
        return bad;
      });
      if (invalid.length) {
        errorBox.textContent = 'Merci de compléter correctement vos informations (champs en rouge).';
        errorBox.hidden = false;
        invalid[0].focus();
        invalid[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }
      errorBox.hidden = true;

      let detailPlats = '';
      cart.forEach(function (item) {
        detailPlats += '- ' + item.quantite + 'x *' + item.nom + '* (' +
          (item.variable ? 'dès ' : '') + fcfa(item.prix * item.quantite) + ')\n';
      });
      const hasVariable = cart.some(function (i) { return i.variable; });

      const surPlace = mode === MODE_SUR_PLACE;
      const vip = surPlace && isVip();
      const precision = evenement.value.trim().replace(/\s*\n\s*/g, ', ');
      const alerte = surPlace ? (vip ? ALERT_VIP : ALERT_STANDARD) + '\n\n' : '';
      const espace = surPlace
        ? '- *Espace :* ' + (vip ? 'Privé VIP / Rooftop (soumis à validation de la direction)' : 'Table standard (salle principale ou terrasse)') + '\n' +
          (vip ? '- *Événement :* ' + (precision || 'Non précisé') + '\n' : '')
        : '';

      const message = alerte + '🛒 *NOUVELLE COMMANDE EN LIGNE - RESTAURANT LE CAVIAR*\n\n' +
        '*Détails des plats :*\n' + detailPlats + '\n' +
        '*Total Commande :* ' + (hasVariable ? 'à partir de ' : '') + fcfa(subtotal()) + '\n\n' +
        '*Infos Client & Livraison :*\n' +
        '- *Nom :* ' + nom.value.trim() + '\n' +
        '- *Téléphone :* ' + telephone.value.trim() + '\n' +
        '- *Mode :* ' + mode + '\n' +
        (mode === 'Livraison à domicile' ? '- *Adresse exacte :* ' + adresse.value.trim().replace(/\s*\n\s*/g, ', ') + '\n' : '') +
        espace +
        '\n_Veuillez me confirmer la prise en compte' + (mode === 'Livraison à domicile' ? ' et le tarif de livraison' : '') +
        (vip ? ' ainsi que la validation de l\'espace VIP / Rooftop par la direction' : '') + '._';

      const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);

      // Vider le panier après commande, puis afficher la confirmation
      cart = [];
      sent = true;
      doneLink.href = url;
      saveCart();
      form.reset();
      syncMode();

      const win = window.open(url, '_blank');
      if (!win) window.location.href = url;
    }

    return render;
  }
})();

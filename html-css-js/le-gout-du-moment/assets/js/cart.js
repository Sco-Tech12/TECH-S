/* LE GOÛT DU MOMENT — panier & commande en ligne (localStorage + WhatsApp)
   JavaScript natif, aucune dépendance. const / let uniquement (aucun var). */
(function () {
  'use strict';

  // Version de la carte : à incrémenter quand les plats ou les prix changent,
  // pour qu'aucun article de l'ancienne carte ne reste dans un panier enregistré.
  const MENU_VERSION = '2026-11-v1';
  const STORAGE_KEY = 'gout_du_moment_panier_' + MENU_VERSION;
  const STAMP_KEY = STORAGE_KEY + '_maj'; // date de dernière modification
  const WHATSAPP_NUMBER = '2290100000000'; // +229 01 00 00 00 00 (ligne de l'établissement)
  const SITE_NAME = 'LE GOÛT DU MOMENT';
  const MAX_QTY = 50;

  // Les trois modes du sélecteur (valeur du bouton radio → libellé du message WhatsApp)
  const MODES = {
    livraison: '🛵 Livraison à domicile (Calavi et environs)',
    emporter: '🛍️ À emporter (Retrait rapide)',
    surplace: '🍽️ Sur place'
  };
  const ESPACES = { terrasse: 'Terrasse', salle: 'Salle' };

  const NAME_PREFIX = STORAGE_KEY + ':';
  const URL_PARAM = 'panier';
  const ORDER_PAGE = 'commander.html';
  const SITE_PAGES = /^((?:index|menu|commander|a-propos|mentions-legales)\.html)(?:\?[^#]*)?(#.*)?$/;
  // Fichiers ouverts directement (double-clic, file://) : selon le navigateur, chaque page a son
  // propre localStorage. Le panier voyage alors aussi dans les liens internes (?panier=…).
  // En ligne (http/https), toutes les pages partagent le même stockage : liens propres.
  const CARRY_IN_LINKS = location.protocol === 'file:';

  /* ---------- Stockage ----------
     Source principale : localStorage (clé STORAGE_KEY). Copies de secours : window.name
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
    try {
      if (stored !== null) copies.push({ t: storedStamp, items: sanitize(JSON.parse(stored)) });
      else if (storedStamp) copies.push({ t: storedStamp, items: [] }); // panier vidé à cette date
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
        // Retire le panier de l'adresse affichée (garde les autres paramètres)
        try {
          const params = new URLSearchParams(location.search);
          params.delete(URL_PARAM);
          const rest = params.toString();
          history.replaceState(null, '', location.pathname + (rest ? '?' + rest : '') + location.hash);
        } catch (e) { /* file:// strict */ }
      }
    }

    if (!copies.length) return { t: 0, items: [] };
    return copies.reduce(function (best, c) { return c.t > best.t ? c : best; });
  }

  let cart = [];
  let stamp = 0;

  function snapshot() {
    return JSON.stringify({ t: stamp, items: cart });
  }
  function persist() {
    try {
      if (cart.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      else localStorage.removeItem(STORAGE_KEY); // panier vide : la clé est supprimée
      localStorage.setItem(STAMP_KEY, String(stamp));
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

  function withCart(page, query, anchor) {
    const params = new URLSearchParams(query || '');
    if (CARRY_IN_LINKS) params.set(URL_PARAM, snapshot());
    const qs = params.toString();
    return page + (qs ? '?' + qs : '') + (anchor || '');
  }
  function cartUrl() {
    return withCart(ORDER_PAGE);
  }
  // Liens internes (file:// uniquement) : le panier y est réécrit à chaque modification
  function updateCartLinks() {
    if (!CARRY_IN_LINKS) return;
    document.querySelectorAll('a[href]').forEach(function (a) {
      const href = a.getAttribute('href');
      const m = href.match(SITE_PAGES);
      if (!m) return;
      const q = href.indexOf('?');
      const params = new URLSearchParams(q === -1 ? '' : href.slice(q + 1).split('#')[0]);
      params.delete(URL_PARAM);
      a.setAttribute('href', withCart(m[1], params.toString(), m[2]));
    });
  }

  /* ---------- Calculs ---------- */
  function fcfa(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
  }
  function countItems() { return cart.reduce(function (s, i) { return s + i.quantite; }, 0); }
  function subtotal() { return cart.reduce(function (s, i) { return s + i.prix * i.quantite; }, 0); }
  function hasVariable() { return cart.some(function (i) { return i.variable; }); }
  function find(id) { return cart.find(function (i) { return i.id === id; }) || null; }

  /* ---------- Badge du panier (toutes les pages) ---------- */
  let lastCount = -1;
  function updateBadge() {
    const n = countItems();
    document.querySelectorAll('.cart-badge').forEach(function (b) {
      b.textContent = n > 99 ? '99+' : String(n);
      b.hidden = n === 0;
      if (n !== lastCount && lastCount !== -1 && n > 0) {
        b.classList.remove('is-pop');
        void b.offsetWidth; // relance l'animation
        b.classList.add('is-pop');
      }
    });
    document.querySelectorAll('.cart-btn').forEach(function (a) {
      a.setAttribute('aria-label', n ? 'Mon panier, ' + n + ' article' + (n > 1 ? 's' : '') : 'Mon panier, vide');
    });
    lastCount = n;
  }

  /* ---------- Notification ---------- */
  let toastEl = null;
  let toastTimer = 0;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.innerHTML = '<svg class="ico ico--sm" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>' +
        '<span class="toast__text"></span><a class="toast__action">Voir le panier</a>';
      document.body.appendChild(toastEl);
    }
    toastEl.querySelector('.toast__text').textContent = msg;
    toastEl.querySelector('.toast__action').href = cartUrl();
    requestAnimationFrame(function () { toastEl.classList.add('is-visible'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 4000);
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
      cart.push({ id: d.id, nom: d.nom, prix: +d.prix, quantite: 1, categorie: d.categorie || '', variable: d.variable === '1' });
    }
    saveCart();
    toast(d.nom + ' ajouté au panier');

    btn.classList.add('is-added');
    clearTimeout(btn._t);
    btn._t = setTimeout(function () { btn.classList.remove('is-added'); }, 900);
  });

  // Synchronise les onglets ouverts en parallèle : la version la plus récente l'emporte
  window.addEventListener('storage', function (e) {
    if (e.key !== STORAGE_KEY && e.key !== STAMP_KEY) return;
    const latest = loadCart();
    if (latest.t >= stamp) { cart = latest.items; stamp = latest.t; updateCartLinks(); refresh(); }
  });
  // Retour arrière (page restaurée depuis le cache du navigateur)
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    const latest = loadCart();
    if (latest.t > stamp) { cart = latest.items; stamp = latest.t; }
    updateCartLinks();
    refresh();
  });

  /* ---------- Démarrage ---------- */
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
    if (document.getElementById('cart-list')) renderPage = initOrderPage();
    refresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  /* ==========================================================================
     Page commander.html
     ========================================================================== */
  function initOrderPage() {
    const list = document.getElementById('cart-list');
    const loading = document.getElementById('cart-loading');
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
    const espaceField = document.getElementById('espace-field');
    const deliveryNote = document.getElementById('sum-delivery-note');
    let sent = false;
    let renderedIds = '';

    const ICONS = {
      minus: '<path d="M5 12h14"/>',
      plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
      trash: '<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>'
    };
    function svg(name, cls) {
      return '<svg class="ico ' + (cls || '') + '" viewBox="0 0 24 24" aria-hidden="true">' + ICONS[name] + '</svg>';
    }
    function el(tag, cls, text) {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text != null) n.textContent = text;
      return n;
    }
    function iconButton(cls, action, label, icon, disabled) {
      const b = el('button', cls);
      b.type = 'button';
      b.dataset.action = action;
      b.setAttribute('aria-label', label);
      b.innerHTML = icon;
      b.disabled = !!disabled;
      return b;
    }

    function renderItem(item, animate) {
      const li = el('li', 'cart-item');
      li.dataset.id = item.id;
      if (!animate) li.style.animation = 'none';

      const info = el('div', 'grow');
      info.appendChild(el('h3', 'cart-item__name', item.nom));
      info.appendChild(el('p', 'cart-item__unit', (item.variable ? 'Dès ' : '') + fcfa(item.prix) + ' / unité'));
      li.appendChild(info);

      li.appendChild(el('p', 'cart-item__total', fcfa(item.prix * item.quantite) + (item.variable ? ' *' : '')));

      const qty = el('div', 'qty');
      qty.setAttribute('role', 'group');
      qty.setAttribute('aria-label', 'Quantité de ' + item.nom);
      qty.appendChild(iconButton('qty__btn', 'dec', 'Diminuer la quantité de ' + item.nom, svg('minus', 'ico--sm'), item.quantite <= 1));
      const value = el('span', 'qty__value');
      value.innerHTML = '<span class="sr-only">Quantité : </span>' + item.quantite;
      qty.appendChild(value);
      qty.appendChild(iconButton('qty__btn', 'inc', 'Augmenter la quantité de ' + item.nom, svg('plus', 'ico--sm'), item.quantite >= MAX_QTY));
      li.appendChild(qty);

      li.appendChild(iconButton('cart-item__remove', 'remove', 'Supprimer ' + item.nom + ' du panier', svg('trash')));
      return li;
    }

    function render() {
      const has = cart.length > 0;
      const ids = cart.map(function (i) { return i.id; }).join('|');
      const known = renderedIds.split('|');
      list.innerHTML = '';
      cart.forEach(function (item) { list.appendChild(renderItem(item, known.indexOf(item.id) === -1)); });
      renderedIds = ids;

      if (has) sent = false;
      loading.hidden = true;
      list.hidden = !has;
      empty.hidden = has || sent;
      done.hidden = has || !sent;
      clearBtn.hidden = !has;
      form.hidden = !has;
      submitBtn.disabled = !has;

      const total = fcfa(subtotal()) + (hasVariable() ? ' *' : '');
      document.getElementById('sum-count').textContent = countItems();
      document.getElementById('sum-subtotal').textContent = total;
      document.getElementById('sum-total').textContent = total;
      document.getElementById('sum-variable').hidden = !hasVariable();
      if (!has) errorBox.hidden = true;
    }

    // Quantités / suppression
    list.addEventListener('click', function (e) {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const row = btn.closest('.cart-item');
      const item = find(row.dataset.id);
      if (!item) return;
      const action = btn.dataset.action;
      if (action === 'remove') {
        row.classList.add('is-leaving');
        setTimeout(function () {
          cart = cart.filter(function (i) { return i.id !== item.id; });
          saveCart();
        }, 200);
        return;
      }
      if (action === 'inc') item.quantite = Math.min(item.quantite + 1, MAX_QTY);
      if (action === 'dec') item.quantite = Math.max(item.quantite - 1, 1);
      saveCart();
      // Garde le focus sur le même bouton après le re-rendu
      const again = list.querySelector('[data-id="' + item.id + '"] [data-action="' + action + '"]');
      if (again && !again.disabled) again.focus();
    });

    clearBtn.addEventListener('click', function () {
      if (!window.confirm('Vider entièrement votre panier ?')) return;
      cart = [];
      saveCart();
    });

    // Mode : livraison / à emporter / sur place (+ choix terrasse ou salle)
    function currentMode() {
      return form.querySelector('input[name="mode"]:checked').value;
    }
    function currentEspace() {
      return form.querySelector('input[name="espace"]:checked').value;
    }
    function syncMode() {
      const mode = currentMode();
      const delivery = mode === 'livraison';
      const surPlace = mode === 'surplace';
      adresseField.hidden = !delivery;
      adresse.required = delivery;
      pickupInfo.hidden = mode !== 'emporter';
      espaceField.hidden = !surPlace;
      deliveryNote.hidden = !delivery;
      document.getElementById('sum-delivery').textContent = delivery ? 'À définir' : surPlace ? 'Aucuns frais (sur place)' : 'Gratuit (retrait)';
    }
    form.addEventListener('change', function (e) {
      if (e.target.name === 'mode') syncMode();
    });
    syncMode();

    form.addEventListener('input', function (e) {
      if (e.target.classList.contains('is-invalid')) e.target.classList.remove('is-invalid');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      envoyerCommandeWhatsApp();
    });

    function oneLine(s) { return s.trim().replace(/\s*\n\s*/g, ', '); }

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
        errorBox.textContent = 'Merci de compléter correctement vos informations (champs signalés).';
        errorBox.hidden = false;
        invalid[0].focus();
        invalid[0].scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }
      errorBox.hidden = true;

      const surPlace = mode === 'surplace';
      const livraison = mode === 'livraison';
      const plats = cart.map(function (i) {
        return '- ' + i.quantite + 'x *' + i.nom + '* (' + (i.variable ? 'dès ' : '') + fcfa(i.prix * i.quantite) + ')';
      }).join('\n');

      const lines = [
        '🛒 *NOUVELLE COMMANDE EN LIGNE - ' + SITE_NAME + '*',
        '',
        '*Détails des plats :*',
        plats,
        '',
        '*Total Commande :* ' + (hasVariable() ? 'à partir de ' : '') + fcfa(subtotal()),
        '',
        '*Infos Client :*',
        '- *Nom :* ' + nom.value.trim(),
        '- *Téléphone :* ' + telephone.value.trim(),
        '- *Mode :* ' + MODES[mode] + (surPlace ? ' (' + ESPACES[currentEspace()] + ')' : '')
      ];
      if (livraison) lines.push('- *Adresse exacte :* ' + oneLine(adresse.value));
      lines.push('', '_Merci de me confirmer la prise en compte' + (livraison ? ' et le tarif de livraison' : '') + '._');

      const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));

      // Panier vidé après commande, puis confirmation
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

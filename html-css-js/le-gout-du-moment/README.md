# LE GOÛT DU MOMENT — Site web (HTML / CSS / JS)

> *Le temple du goût et de la convivialité à Calavi.*

Togoudo, près de l'école de base (à 100 m du Carrefour Maria Gléta), Abomey-Calavi, Bénin.
WhatsApp de réception des commandes : **+229 01 00 00 00 00**.

HTML / CSS / JavaScript natifs, aucune dépendance. JavaScript : `const` / `let` uniquement, **aucun `var`**.

## Lancer en local

```bash
python3 -m http.server 8080   # puis http://localhost:8080
```

## Structure

```
le-gout-du-moment/
├── index.html             # Accueil : héro ardoise, incontournables, 3 modes, adresse + carte
├── menu.html              # La carte (boutons « Ajouter »)
├── commander.html         # Panier + formulaire → WhatsApp
├── a-propos.html          # Notre histoire
├── mentions-legales.html · 404.html · robots.txt · sitemap.xml
├── tools/build.py         # Générateur des pages HTML (gabarit commun header/footer)
└── assets/
    ├── css/style.css      # Palette « Bistro & Chalkboard » (mobile first)
    ├── js/cart.js         # Panier (localStorage), badge, notification, commande WhatsApp
    ├── js/main.js         # Menu mobile, apparitions au scroll, catégories, carte Google Maps
    └── img/favicon.svg
```

## Modifier le contenu

Les pages HTML sont générées : modifier `tools/build.py` (carte dans `MENU`, coordonnées en tête), puis :

```bash
python3 tools/build.py .
```

- Après un changement de plats ou de prix : incrémenter `MENU_VERSION` dans `assets/js/cart.js`.
- Numéro WhatsApp : `WHATSAPP_NUMBER` dans `cart.js` + `WA` / `PHONE_*` dans `build.py`.

## Formulaire de commande

Sélecteur à trois choix : 🛵 **Livraison à domicile** (Calavi et environs, adresse obligatoire) ·
🛍️ **À emporter** (Retrait rapide) · 🍽️ **Sur Place** (choix Terrasse ou Salle).
Le message WhatsApp reprend les plats, le total, le nom, le téléphone, le mode (et l'espace ou l'adresse).

## Palette « Bistro & Chalkboard »

| Variable | Couleur | Usage |
|---|---|---|
| `--bg-dark` | `#1E1F22` | Navbar, fond général, footer (noir tableau mat) |
| `--bg-light` | `#FFFFFF` | Sections claires, panier |
| `--accent-color` | `#D4AF37` | Boutons d'action, prix, titres de standing |
| `--accent-ink` | `#8B6914` | Petits textes dorés sur blanc (l'or pur sur blanc n'est pas lisible) |

## À compléter avant la mise en ligne

- **Carte et prix réels** : les plats actuels sont un EXEMPLE à remplacer par la carte officielle.
- **Horaires d'ouverture** (absents du site pour l'instant).
- Logo, photos, domaine définitif (`URL` dans `build.py`), point GPS exact pour Google Maps, hébergeur (mentions légales).

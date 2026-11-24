# RESTAURANT LE CAVIAR — Site web

> *Une expérience culinaire d'exception à Abomey-Calavi.*

Site vitrine et commande en ligne (accueil, carte, panier, réservation, à propos) pour **RESTAURANT LE CAVIAR**.
HTML / CSS / JavaScript natifs : aucune dépendance, aucun build.

## Structure

```
restaurant-le-caviar/
├── index.html            # Accueil (Nos espaces, Plats phares, Spécialités, Contact)
├── menu.html             # Menu officiel : grillades & steaks, pizzas, entrées, desserts, cocktails
├── commander.html        # Panier + commande en ligne → WhatsApp
├── reservation.html      # Formulaire de réservation → WhatsApp
├── a-propos.html         # Notre histoire
├── assets/
│   ├── css/style.css     # Styles mobile first + charte « Luxe & Caviar » (variables CSS)
│   ├── css/a-propos.css  # Styles propres à la page À propos
│   ├── js/main.js        # Burger, filtres, animations, réservation (horaires 11h–01h)
│   ├── js/cart.js        # Panier (localStorage), badge, totaux FCFA, commande WhatsApp
│   └── img/              # favicon.svg ; photos à déposer dans img/a-propos/
└── README.md
```

## Lancer en local

```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

## Informations de l'établissement

| | |
|---|---|
| Adresse | Rue derrière l'Hôpital International de Calavi (CHIC), rue de la Pharmacie Zoca, Abomey-Calavi, Bénin |
| WhatsApp | +229 01 00 00 00 00 (`2290100000000`) |
| Horaires | Ouvert 7j/7 de 11h00 à 01h00 du matin |

Le numéro se modifie dans `assets/js/cart.js` et `assets/js/main.js` (`WHATSAPP_NUMBER`).

## Commande en ligne

Chaque bouton `data-add` ajoute le plat au panier, stocké dans `localStorage` (clé `caviar_panier`).
Les totaux sont recalculés en direct en FCFA. Sur `commander.html`, le client ajuste les quantités,
choisit Livraison ou À emporter, puis la commande part en message WhatsApp formaté vers le restaurant.
Les articles à prix variable (`data-variable="1"`, ex. bières & vins « dès 2 000 FCFA ») sont signalés « dès … »
et le total « à partir de ». Badges dorés : « Chef » (T-Bone Steak) et « Exclusif » (Pizza Le Caviar).

## Type de réservation (Table Standard / Espace VIP-Rooftop)

- `reservation.html` : choix obligatoire entre 🍽️ Table Standard et 👑 Espace Privé VIP / Rooftop (soumis à validation de la direction).
- `commander.html` : le même choix apparaît avec le mode « Sur place » (en plus de Livraison et À emporter).
- En VIP, un champ optionnel « Événement » s'affiche (anniversaire, réunion d'affaires, privatisation…).
- Le message WhatsApp commence par l'alerte `🚨 DEMANDE DE RÉSERVATION : ESPACE VIP / ROOFTOP 👑`
  ou `📩 DEMANDE DE RÉSERVATION : TABLE STANDARD 🍽️` (constantes `ALERT_VIP` / `ALERT_STANDARD` dans `main.js` et `cart.js`).

## Charte graphique « Luxe, Nuit & Grillades premium »

| Variable | Couleur | Utilisation |
|---|---|---|
| `--bg-dark` | `#12161A` | Gris anthracite : navbar, hero, footer |
| `--bg-light` | `#F4F6F9` | Gris perle : sections claires, menu |
| `--accent-color` | `#9B111E` | Rouge rubis : prix, badges « Chef », boutons « Ajouter au panier » |
| `--text-light` | `#FAFDFA` | Blanc pur : textes sur fond sombre |
| `--border-silver` | `#E5E8EB` | Lignes de séparation |

Survol des boutons : `--accent-color` → `--accent-hover` (`#7A1C24`, rouge plus sombre et tamisé).
Petits textes rubis sur fond anthracite : `--accent-on-dark` (`#E04B57`) pour rester lisibles.
Typographie géométrique sans-serif : Jost (titres) et Manrope (texte).

## À compléter

- Photos réelles (salle VIP, Rooftop, plats) dans `assets/img/a-propos/` (`hero.jpg`, `table.jpg`, `plat.jpg`).
- Zone et tarif de livraison.

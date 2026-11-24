# Kama Délice Restaurant — Site web

> *Parce que nous vous servons par amour…*

Site vitrine mobile first (accueil, carte, réservation, commande en ligne), pour **Kama Délice Restaurant** (Abomey-Calavi, Bénin).
HTML / CSS / JavaScript natifs : aucune dépendance, aucun build, chargement ultra-rapide.

## Structure

```
kama-delice-restaurant/
├── index.html            # Accueil (Cadre, Menu, Cuisines, Contact)
├── menu.html             # Carte officielle complète + Formule Hebdo
├── reservation.html      # Formulaire de réservation → WhatsApp
├── commander.html        # Panier + commande en ligne → WhatsApp
├── assets/
│   ├── css/style.css     # Styles mobile first + charte graphique (variables CSS)
│   ├── js/main.js        # Burger, filtres menu, animations, réservation
│   ├── js/cart.js        # Panier (localStorage), badge, commande WhatsApp
│   └── img/favicon.svg
└── README.md
```

## Lancer en local

```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```

## Réservation WhatsApp

Les boutons « Réserver une table » (classe `js-reserve`) mènent à `reservation.html`.
Le bouton flottant (classe `js-whatsapp`) pointe vers
`https://wa.me/2290100000000?text=…` avec un message pré-rempli.
Le formulaire de réservation compose un message détaillé (nom, téléphone, email, date, heure, couverts, demandes).
Le numéro se modifie dans `assets/js/main.js` (`WHATSAPP_NUMBER`).

## Commande en ligne

Chaque bouton `data-add` (carte et accueil) ajoute le plat au panier, stocké dans `localStorage` (clé `kama_panier`, identique sur toutes les pages).
Si le navigateur ne partage pas ce stockage entre les pages (fichiers ouverts en `file://`, navigation privée),
le panier est aussi gardé dans `window.name` et, en `file://` uniquement, transmis dans les liens internes (`?panier=…`).
Chaque copie est datée : la plus récente l'emporte, y compris un panier vidé.
Le badge de l'icône panier se met à jour sur toutes les pages. Sur `commander.html`, le client ajuste les
quantités, choisit Livraison à domicile ou À emporter, puis la commande part en message WhatsApp au restaurant.
Les plats à prix variable (`data-variable="1"`) sont signalés « dès … » et le total « à partir de ».

## Charte graphique

| Rôle | Couleur |
|---|---|
| Marron chaud (identité) | `#5C3A21` |
| Or doré / ambre | `#D4AF37` |
| Fond sombre (lounge) | `#1E1B18` |
| Fond clair | `#FAFDFA` |
| Vert nature (jardin) | `#3B533E` |

## À compléter

- Photos réelles des plats et du lieu (remplacer les visuels illustrés `.dish__img--*` et `.ambiance__visual--*`).
- Horaires d'ouverture.
- Prix du menu du jour (Formule Hebdo) et contenu des menus.

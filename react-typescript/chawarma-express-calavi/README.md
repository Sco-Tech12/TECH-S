# Chawarma Express Calavi — version React + TypeScript

Site d'un restaurant fast-food d'Abomey-Calavi (Bénin) : carte, panier, commande et réservation envoyées sur WhatsApp.
C'est le **portage en React + TypeScript** d'un site d'abord écrit en HTML / CSS / JavaScript natifs : même design,
mêmes contenus et **même comportement**, vérifié page par page.

## Technologies

- **React 19** + **TypeScript** (mode strict)
- **Vite** (build et serveur de développement)
- **React Router** (pages : accueil, menu, panier, réservation, à propos, mentions légales, 404)
- **Motion** (détection des apparitions au défilement)
- CSS d'origine conservé tel quel (mobile first, variables CSS)

## Fonctionnalités

- **Carte de 17 plats** avec badges (best-seller, géant) et prix variables (« dès … »)
- **Panier** enregistré dans le navigateur (`localStorage`), synchronisé entre onglets, versionné avec la carte
- **Commande WhatsApp** : livraison, à emporter ou sur place (terrasse ou salon VIP), message prérempli
- **Réservation WhatsApp** avec contrôle des horaires (service jusqu'à 01h00, heure du Bénin)
- Statut **ouvert / fermé** en direct, jour courant mis en évidence
- Carte Google Maps **chargée seulement au clic** (économie de données mobiles)
- Menu mobile accessible (focus, touche Échap), lien d'évitement, annonces pour lecteurs d'écran
- Pages chargées à la demande et bibliothèques dans un fichier séparé (mises en cache)

## Organisation du code

```
src/
├── config/site.ts        # nom, coordonnées, horaires, espaces, navigation
├── data/menu.ts          # la carte (typée)
├── cart/                 # panier : contexte React + enregistrement daté dans le navigateur
├── lib/                  # prix en FCFA, horaires (fuseau Africa/Porto-Novo)
├── components/           # en-tête, menu mobile, pied de page, boutons, horaires, carte…
├── pages/                # une page par fichier
└── styles/               # feuille de style d'origine
```

## Lancer en local

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # vérification TypeScript + build de production dans dist/
```

Déploiement : `vercel.json` renvoie toutes les adresses vers `index.html` (application à une seule page).

> Les coordonnées (téléphone, WhatsApp) sont **fictives** dans ce dépôt public.

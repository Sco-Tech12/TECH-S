# TECH-S — Sites web de restaurants

Sélection de sites vitrines réalisés pour des restaurants d'Abomey-Calavi (Bénin) : présentation, carte, panier,
commande et réservation envoyées sur WhatsApp. Tous sont pensés **mobile first**, pour des téléphones d'entrée de
gamme et des connexions modestes.

## Projets

| Projet | Technologies | Points clés |
|---|---|---|
| [Chawarma Express Calavi](react-typescript/chawarma-express-calavi) | React 19, TypeScript, Vite, React Router, Motion | Portage complet d'un site HTML en React : panier typé, commande et réservation WhatsApp, pages chargées à la demande |
| [Kama Délice](html-css-js/kama-delice) | HTML, CSS, JavaScript | Carte complète, formule de la semaine, panier et commande WhatsApp |
| [Le Goût du Moment](html-css-js/le-gout-du-moment) | HTML, CSS, JavaScript | Carte, panier, commande, référencement (sitemap, robots), page 404 |
| [Le Caviar](html-css-js/le-caviar) | HTML, CSS, JavaScript | Positionnement haut de gamme, réservation et commande WhatsApp |

## Compétences mises en œuvre

- Intégration responsive (mobile first), variables CSS, animations légères respectant `prefers-reduced-motion`
- JavaScript natif sans dépendance : panier en `localStorage`, validation de formulaires, horaires selon le fuseau du Bénin
- React + TypeScript : composants, contexte, hooks, routage, découpage du code
- Accessibilité : navigation au clavier, lecteurs d'écran, contrastes
- Performance : aucune ressource inutile, carte chargée au clic, polices et images optimisées

## Lancer un projet

- **Sites HTML / CSS / JS** : ouvrir le dossier puis `python3 -m http.server 8080` (ou ouvrir `index.html`).
- **Site React** : `cd react-typescript/chawarma-express-calavi && pnpm install && pnpm dev`.

> Les numéros de téléphone et adresses e-mail des restaurants ont été remplacés par des **coordonnées fictives**.

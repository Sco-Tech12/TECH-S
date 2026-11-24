/**
 * Informations du restaurant, centralisées (une seule source pour toutes les pages).
 * Numéro de démonstration : remplacé par un numéro fictif pour la publication du code.
 */
export const SITE = {
  name: 'CHAWARMA EXPRESS - CALAVI',
  shortName: 'Chawarma Express',
  city: 'Calavi',
  slogan: 'La rapidité et le goût authentique à Abomey-Calavi.',
  description:
    "Chawarmas, burgers, pizzas au feu de bois et jus frais en face de l'Université d'Abomey-Calavi (UAC). Commande en ligne sur WhatsApp, terrasse fast-food et salon VIP climatisé.",
  /** Numéro fictif (format béninois) : affichage, lien tel: et WhatsApp. */
  phoneDisplay: '+229 01 00 00 00 00',
  phoneTel: '+2290100000000',
  whatsapp: '2290100000000',
  address: "En face de l'Université d'Abomey-Calavi (UAC), route inter-états, Abomey-Calavi, Bénin",
  /** Horaires : 7j/7 de 11h00 à 01h00 du matin (le service déborde sur le lendemain). */
  open: '11:00',
  close: '01:00',
  timeZone: 'Africa/Porto-Novo', // UTC+1, pas d'heure d'été
} as const;

const mapsQuery = encodeURIComponent(`${SITE.name}, ${SITE.address}`);
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
export const MAPS_EMBED = `https://maps.google.com/maps?q=${mapsQuery}&z=16&output=embed`;

export const HELLO_MESSAGE = `Bonjour ${SITE.name}, je vous contacte depuis votre site web.`;

/** Lien WhatsApp avec un message prérempli. */
export const waLink = (message: string): string => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;

/** Espaces sur place (réservation et commande « sur place »). */
export type Espace = 'terrasse' | 'vip';
export const ESPACES: Record<Espace, { emoji: string; title: string; text: string; label: string; alert: string }> = {
  terrasse: {
    emoji: '🍽️',
    title: 'Espace Terrasse / Fast-Food',
    text: "Idéal pour manger rapidement en face de l'université",
    label: 'Espace Terrasse / Fast-Food (repas rapide)',
    alert: '*📩 DEMANDE DE RÉSERVATION : ESPACE TERRASSE / FAST-FOOD 🍽️*',
  },
  vip: {
    emoji: '👑',
    title: 'Espace Salon VIP Climatisé',
    text: 'Pour des repas plus calmes ou réunions de groupe',
    label: 'Espace Salon VIP Climatisé (calme, groupes)',
    alert: '*🚨 DEMANDE DE RÉSERVATION : ESPACE SALON VIP CLIMATISÉ 👑*',
  },
};

/** Navigation principale (en-tête, menu mobile). */
export const NAV = [
  { to: '/', label: 'Accueil' },
  { to: '/menu', label: 'Menu' },
  { to: '/reservation', label: 'Réservation' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/#infos', label: 'Nous trouver' },
] as const;

/** Exemple de numéro affiché dans les champs téléphone (fictif). */
export const PHONE_PLACEHOLDER = '01 00 00 00 00';
/** Numéro béninois à 10 chiffres commençant par 01 (avec ou sans +229). */
export const PHONE_PATTERN = String.raw`^(\+?229[\s.\-]?)?01([\s.\-]?\d{2}){4}$`;

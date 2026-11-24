/**
 * Carte officielle (17 plats). Après un changement de plats ou de prix, incrémenter MENU_VERSION
 * (src/cart/storage.ts) : les anciens paniers enregistrés sont alors ignorés.
 */
export type Badge = { tone: 'red' | 'yellow'; text: string };
export interface Dish {
  id: string;
  nom: string;
  desc: string;
  /** Prix en FCFA (minimum si `variable`). */
  prix: number;
  categorie: string;
  badge?: Badge;
  /** Prix variable : « dès … », montant final confirmé sur WhatsApp. */
  variable?: boolean;
}
export interface Category {
  id: string;
  title: string;
  note: string;
  dishes: Dish[];
}

export const MENU: Category[] = [
  {
    id: "chawarmas",
    title: "Les Rois du Chawarma Express",
    note: "Le best-seller",
    dishes: [
      { id: "chawarma-simple", nom: "Chawarma Simple (Viande ou Poulet)", desc: "Galette fine roulée, émincé de viande marinée, frites et crème d'ail maison.", prix: 1500, categorie: "Les Rois du Chawarma Express" },
      { id: "chawarma-special-express", nom: "Chawarma Spécial Express (Format Géant)", desc: "Double portion de viande (ou poulet), frites croustillantes intégrées, crudités et double sauce.", prix: 2000, categorie: "Les Rois du Chawarma Express", badge: { tone: 'red', text: "BEST-SELLER" } },
      { id: "chawarma-royal-double-fromage", nom: "Chawarma Royal Double Fromage", desc: "La recette géante avec une coulée massive de mozzarella fondante.", prix: 2500, categorie: "Les Rois du Chawarma Express" },
      { id: "chawarma-box", nom: "Chawarma Box", desc: "Boîte remplie de viande de chawarma effilochée, posée sur un lit de frites et nappée de sauces au choix.", prix: 3000, categorie: "Les Rois du Chawarma Express" },
    ],
  },
  {
    id: "burgers",
    title: "Les Burgers Fast-Food",
    note: "Servis avec frites",
    dishes: [
      { id: "express-cheeseburger", nom: "Express Cheeseburger", desc: "Pain brioché, steak de bœuf juteux, cheddar fondu, cornichons et sauce burger maison.", prix: 2500, categorie: "Les Burgers Fast-Food" },
      { id: "crispy-chicken-burger", nom: "Crispy Chicken Burger", desc: "Filet de poulet pané ultra-croustillant, fromage, salade et sauce tartare.", prix: 3000, categorie: "Les Burgers Fast-Food" },
      { id: "monster-express-xxl", nom: "Le Monster Express XXL", desc: "Triple steaks de bœuf, bacon, œuf au plat, triple cheddar et oignons caramélisés.", prix: 4500, categorie: "Les Burgers Fast-Food", badge: { tone: 'yellow', text: "GÉANT" } },
    ],
  },
  {
    id: "pizzas",
    title: "Pizzas au Feu de Bois",
    note: "Généreuses & croustillantes",
    dishes: [
      { id: "pizza-express-signature", nom: "Pizza Express (La Signature)", desc: "Base tomate, mozzarella, émincé de viande de chawarma, oignons et poivrons.", prix: 5000, categorie: "Pizzas au Feu de Bois", badge: { tone: 'red', text: "BEST-SELLER" } },
      { id: "pizza-carnivore", nom: "Pizza Carnivore", desc: "Viande hachée, pepperoni, merguez, jambon et mozzarella.", prix: 5000, categorie: "Pizzas au Feu de Bois" },
      { id: "pizza-quatre-fromages", nom: "Pizza Quatre Fromages", desc: "Mozzarella, emmental, bleu et parmesan.", prix: 4500, categorie: "Pizzas au Feu de Bois" },
      { id: "pizza-margherita", nom: "Pizza Margherita", desc: "Sauce tomate, double mozzarella, origan et filet d'olive.", prix: 3000, categorie: "Pizzas au Feu de Bois" },
    ],
  },
  {
    id: "frites-poulet",
    title: "Coin Frites & Poulet Croustillant",
    note: "Croustillant & doré",
    dishes: [
      { id: "frites-simple", nom: "Portion de Frites Simple", desc: "Grandes frites dorées et croustillantes.", prix: 1000, categorie: "Coin Frites & Poulet Croustillant" },
      { id: "wings-x6", nom: "Ailes de Poulet Panées (Les 6 Wings)", desc: "Ailerons de poulet épicés et croustillants servis avec frites.", prix: 2500, categorie: "Coin Frites & Poulet Croustillant" },
      { id: "poulet-croustillant-entier", nom: "Poulet Croustillant entier", desc: "Idéal à partager, servi avec sa sauce ketchup-mayo.", prix: 5000, categorie: "Coin Frites & Poulet Croustillant" },
    ],
  },
  {
    id: "jus-refresh",
    title: "Comptoir des Jus & Refresh",
    note: "Bien frais",
    dishes: [
      { id: "jus-ananas", nom: "Jus d'Ananas frais local", desc: "Jus d'ananas frais, produit local.", prix: 1000, categorie: "Comptoir des Jus & Refresh" },
      { id: "milkshake", nom: "Milkshakes Gourmands", desc: "Parfums Oreo, Chocolat ou Vanille avec crème chantilly.", prix: 2000, categorie: "Comptoir des Jus & Refresh" },
      { id: "boissons-gazeuses-eau", nom: "Boissons gazeuses et eau fraîche", desc: "Au comptoir.", prix: 500, categorie: "Comptoir des Jus & Refresh", variable: true },
    ],
  },
];

const ALL = MENU.flatMap((c) => c.dishes);
export const dish = (id: string): Dish => {
  const d = ALL.find((x) => x.id === id);
  if (!d) throw new Error(`Plat inconnu : ${id}`);
  return d;
};

/** Ticket « Les plus demandés » de l'accueil. */
export const TICKET = ['chawarma-special-express', 'chawarma-royal-double-fromage', 'monster-express-xxl'].map(dish);
/** « Les incontournables » de l'accueil (le premier est mis en avant). */
export const FEATURED = ['chawarma-special-express', 'chawarma-royal-double-fromage', 'monster-express-xxl', 'pizza-express-signature'].map(dish);

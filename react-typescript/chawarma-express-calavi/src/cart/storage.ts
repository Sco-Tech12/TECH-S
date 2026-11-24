/**
 * Enregistrement du panier dans le navigateur (localStorage), comme la version HTML :
 * - la clé dépend de la version de la carte (anciens paniers ignorés après un changement de plats ou de prix) ;
 * - chaque enregistrement est daté : entre plusieurs onglets, la version la plus récente l'emporte, y compris un panier
 *   vidé (une ancienne copie ne fait jamais réapparaître des plats supprimés) ;
 * - données relues avec prudence (stockage bloqué ou valeur modifiée à la main : ignorées).
 */
export const MENU_VERSION = '2026-11-officiel';
export const STORAGE_KEY = `chawarma_express_panier_${MENU_VERSION}`;
export const STAMP_KEY = `${STORAGE_KEY}_maj`;
export const MAX_QTY = 50;

export interface CartItem {
  id: string;
  nom: string;
  prix: number;
  quantite: number;
  categorie: string;
  variable: boolean;
}
export interface CartSnapshot {
  t: number;
  items: CartItem[];
}

export function sanitize(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((i): i is Record<string, unknown> => !!i && typeof i === 'object' && typeof (i as { id?: unknown }).id === 'string' && Number((i as { prix?: unknown }).prix) > 0 && Number((i as { quantite?: unknown }).quantite) >= 1)
    .slice(0, 100)
    .map((i) => ({
      id: String(i.id).slice(0, 80),
      nom: String(i.nom ?? '').slice(0, 120),
      prix: Math.round(Number(i.prix)),
      quantite: Math.min(Math.floor(Number(i.quantite)), MAX_QTY),
      categorie: String(i.categorie ?? '').slice(0, 60),
      variable: !!i.variable,
    }));
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function loadCart(): CartSnapshot {
  const stored = read(STORAGE_KEY);
  const t = Number(read(STAMP_KEY)) || 0;
  if (stored === null) return { t, items: [] }; // jamais rempli, ou vidé à la date `t`
  try {
    return { t, items: sanitize(JSON.parse(stored)) };
  } catch {
    return { t: 0, items: [] }; // valeur illisible : ignorée
  }
}

export function saveCart(snapshot: CartSnapshot): void {
  try {
    if (snapshot.items.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot.items));
    else localStorage.removeItem(STORAGE_KEY); // panier vide : la clé est supprimée
    localStorage.setItem(STAMP_KEY, String(snapshot.t));
  } catch {
    /* stockage bloqué (navigation privée stricte) : le panier reste en mémoire pour la visite */
  }
}

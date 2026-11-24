import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Dish } from '../data/menu.ts';
import { loadCart, MAX_QTY, saveCart, STAMP_KEY, STORAGE_KEY, type CartItem, type CartSnapshot } from './storage.ts';

interface CartApi {
  items: CartItem[];
  count: number;
  subtotal: number;
  hasVariable: boolean;
  add: (dish: Dish) => void;
  setQuantity: (id: string, quantite: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  /** Dernier ajout (pour la notification) : change à chaque ajout. */
  lastAdded: { nom: string; at: number } | null;
}

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartSnapshot>(loadCart);
  const [lastAdded, setLastAdded] = useState<CartApi['lastAdded']>(null);
  const latest = useRef(cart);
  latest.current = cart;

  /** Toute modification est datée puis enregistrée. */
  const update = useCallback((next: (items: CartItem[]) => CartItem[]) => {
    setCart((c) => {
      const snapshot = { t: Date.now(), items: next(c.items) };
      saveCart(snapshot);
      return snapshot;
    });
  }, []);

  // Onglets ouverts en parallèle : la version la plus récente l'emporte.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY && e.key !== STAMP_KEY) return;
      const fresh = loadCart();
      if (fresh.t >= latest.current.t) setCart(fresh);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const add = useCallback((dish: Dish) => {
    update((items) => {
      const found = items.find((i) => i.id === dish.id);
      if (found) return items.map((i) => (i.id === dish.id ? { ...i, quantite: Math.min(i.quantite + 1, MAX_QTY) } : i));
      return [...items, { id: dish.id, nom: dish.nom, prix: dish.prix, quantite: 1, categorie: dish.categorie, variable: !!dish.variable }];
    });
    setLastAdded({ nom: dish.nom, at: Date.now() });
  }, [update]);

  const setQuantity = useCallback((id: string, quantite: number) => {
    update((items) => items.map((i) => (i.id === id ? { ...i, quantite: Math.max(1, Math.min(quantite, MAX_QTY)) } : i)));
  }, [update]);
  const remove = useCallback((id: string) => update((items) => items.filter((i) => i.id !== id)), [update]);
  const clear = useCallback(() => update(() => []), [update]);

  const api = useMemo<CartApi>(() => ({
    items: cart.items,
    count: cart.items.reduce((s, i) => s + i.quantite, 0),
    subtotal: cart.items.reduce((s, i) => s + i.prix * i.quantite, 0),
    hasVariable: cart.items.some((i) => i.variable),
    add, setQuantity, remove, clear, lastAdded,
  }), [cart.items, add, setQuantity, remove, clear, lastAdded]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans <CartProvider>.');
  return ctx;
}

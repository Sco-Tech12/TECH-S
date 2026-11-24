import { useEffect, useRef, useState } from 'react';
import type { Dish } from '../data/menu.ts';
import { useCart } from '../cart/CartContext.tsx';
import { Icon } from './Icon.tsx';

/** Bouton « Ajouter » : ajoute le plat au panier et affiche « Ajouté » pendant un court instant. */
export function AddButton({ dish }: { dish: Dish }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <button type="button" className={`add-btn${added ? ' is-added' : ''}`} aria-label={`Ajouter ${dish.nom} au panier`}
      onClick={() => {
        add(dish);
        setAdded(true);
        clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setAdded(false), 900);
      }}>
      <Icon name="plus" className="ico-plus" /><Icon name="check" className="ico-check" />
      <span className="lbl-add">Ajouter</span><span className="lbl-added">Ajouté</span>
    </button>
  );
}

export function Badge({ dish }: { dish: Dish }) {
  return dish.badge ? <span className={`badge badge--${dish.badge.tone}`}>{dish.badge.text}</span> : null;
}

export function Price({ dish, small = false }: { dish: Dish; small?: boolean }) {
  const amount = `${String(dish.prix).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA`;
  return <span className={`price ${small ? 'price--sm' : ''}`}>{dish.variable && <small>dès </small>}{amount}</span>;
}

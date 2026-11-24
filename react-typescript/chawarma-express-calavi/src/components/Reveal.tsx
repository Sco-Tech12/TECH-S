import { useRef, type ComponentPropsWithoutRef, type ElementType } from 'react';
import { useInView } from 'motion/react';

/**
 * Apparition au défilement (classes `.reveal` / `.stagger` de la feuille de style d'origine) : la classe `is-visible`
 * est ajoutée une seule fois quand l'élément entre à l'écran. Détection par `useInView` (Motion) ; l'animation reste en
 * CSS (opacity + transform), et la feuille de style la désactive si l'utilisateur préfère réduire les animations.
 */
type RevealProps<T extends ElementType> = { as?: T; kind?: 'reveal' | 'stagger'; className?: string } & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>;

export function Reveal<T extends ElementType = 'div'>({ as, kind = 'reveal', className = '', ...rest }: RevealProps<T>) {
  const Tag: ElementType = as ?? 'div';
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  return <Tag ref={ref} {...rest} className={`${className ? `${className} ` : ''}${kind}${visible ? ' is-visible' : ''}`} />;
}

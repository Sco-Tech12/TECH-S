import { Reveal } from './Reveal.tsx';

export function Heading({ eyebrow, title, sub }: { eyebrow?: string; title: string; sub?: string }) {
  return (
    <Reveal className="heading">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="heading__title">{title}</h2>
      {sub && <p className="heading__sub">{sub}</p>}
    </Reveal>
  );
}

/** Damier décoratif (bandeau fast-food). */
export const Checker = () => <div className="checker" aria-hidden="true" />;

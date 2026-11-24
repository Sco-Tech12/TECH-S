import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { MENU } from '../data/menu.ts';
import { AddButton, Badge, Price } from '../components/AddButton.tsx';
import { Checker } from '../components/Heading.tsx';
import { Icon } from '../components/Icon.tsx';
import { Reveal } from '../components/Reveal.tsx';
import { Seo } from '../components/Seo.tsx';

/** Catégorie visible au milieu de l'écran : pastille active dans la barre des catégories (défilement horizontal). */
function useActiveCategory(): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
    }, { rootMargin: '-30% 0px -60% 0px' });
    document.querySelectorAll('.carte__cat').forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);
  return active;
}

export function Menu() {
  const active = useActiveCategory();
  const bar = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const link = bar.current?.querySelector<HTMLElement>('.cat-nav__link.is-active');
    if (link && bar.current) bar.current.scrollTo({ left: link.offsetLeft - 16, behavior: 'smooth' });
  }, [active]);

  return (
    <>
      <Seo title="Menu & commande en ligne" description="Chawarmas, burgers, pizzas au feu de bois, poulet croustillant et jus de CHAWARMA EXPRESS - CALAVI. Ajoutez vos plats au panier, total en FCFA, commande envoyée sur WhatsApp." />
      <section className="bg-dark">
        <div className="container page-head__inner hero-rise">
          <Link to="/" className="back"><Icon name="arrowLeft" className="ico--sm" /> Retour à l'accueil</Link>
          <p className="page-head__eyebrow">La carte</p>
          <h1 className="page-head__title">Menu Chawarma Express</h1>
          <p className="page-head__lead">Ajoutez vos plats au panier : le total se calcule en direct, puis la commande part sur WhatsApp.</p>
        </div>
        <Checker />
      </section>
      <nav className="cat-nav" aria-label="Catégories du menu">
        <ul className="container cat-nav__list" ref={bar}>
          {MENU.map((c) => <li key={c.id}><a href={`#${c.id}`} className={`cat-nav__link${active === c.id ? ' is-active' : ''}`}>{c.title}</a></li>)}
        </ul>
      </nav>
      <div className="container carte">
        <div className="carte__cats">
          {MENU.map((c, i) => (
            <section key={c.id} id={c.id} className="carte__cat" aria-labelledby={`${c.id}-titre`}>
              <Reveal className="carte__head">
                <span className="carte__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div><h2 id={`${c.id}-titre`} className="carte__title">{c.title}</h2><p className="carte__note">{c.note}</p></div>
              </Reveal>
              <Reveal as="ul" kind="stagger" className="carte__list">
                {c.dishes.map((d) => (
                  <li key={d.id} className="item">
                    <div className="grow">
                      <div className="item__top"><h3 className="item__name">{d.nom}</h3><Badge dish={d} /></div>
                      <p className="item__desc">{d.desc}</p>
                      <Price dish={d} />
                    </div>
                    <AddButton dish={d} />
                  </li>
                ))}
              </Reveal>
            </section>
          ))}
        </div>
        <Reveal className="carte__cta">
          <div><p className="carte__cta-title">Panier prêt ?</p><p>Livraison, à emporter ou sur place (terrasse ou salon VIP climatisé).</p></div>
          <Link to="/commander" className="btn btn--red btn--bold btn--static">Voir mon panier <Icon name="arrowRight" /></Link>
        </Reveal>
        <p className="carte__foot">« dès » : prix variable selon votre choix, montant final confirmé sur WhatsApp.</p>
      </div>
    </>
  );
}

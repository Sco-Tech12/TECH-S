import { Link } from 'react-router';
import { Checker } from '../components/Heading.tsx';
import { Icon } from '../components/Icon.tsx';
import { Reveal } from '../components/Reveal.tsx';
import { Seo } from '../components/Seo.tsx';

export function About() {
  return (
    <>
      <Seo title="À propos" description="CHAWARMA EXPRESS - CALAVI : le chawarma express d'en face de l'Université d'Abomey-Calavi. La rapidité et le goût authentique à Abomey-Calavi." />
      <section className="about-hero" aria-labelledby="about-title">
        <div className="container about-hero__inner hero-rise">
          <p className="about-hero__eyebrow">Notre histoire</p>
          <h1 className="about-hero__title" id="about-title">Chawarma <span>Express</span><br />Calavi</h1>
          <p className="about-hero__lead">La rapidité et le goût authentique à Abomey-Calavi.</p>
        </div>
        <span className="about-hero__ghost" aria-hidden="true">UAC</span>
        <Checker />
      </section>

      <section className="section bg-white">
        <div className="container about-split">
          <Reveal as="h2" className="about-split__title">Pensé pour la pause <span>entre deux cours.</span></Reveal>
          <Reveal className="about-split__text" style={{ ['--d' as string]: '.1s' }}>
            <p>Installé juste en face de l'Université d'Abomey-Calavi, au bord de la route inter-états, CHAWARMA EXPRESS - CALAVI part d'une idée simple : quand on a peu de temps, on ne devrait pas avoir à choisir entre manger vite et bien manger.</p>
            <p>Les broches tournent, les galettes sont roulées à la minute, les sauces sont faites maison. Vous commandez au comptoir ou en ligne, et votre chawarma est prêt sans détour.</p>
            <Link to="/menu" className="link-arrow">Découvrir le menu <Icon name="arrowRight" className="ico--sm" /></Link>
          </Reveal>
        </div>
      </section>

      <section className="section bg-muted" aria-labelledby="values-title">
        <div className="container">
          <Reveal as="h2" id="values-title" className="title-xl">Ce qui nous définit</Reveal>
          <Reveal as="ul" kind="stagger" className="values">
            <li className="value value--red"><Icon name="timer" /><h3 className="value__title">La rapidité</h3><p>Chawarmas, burgers et pizzas au feu de bois : une cuisine organisée pour servir vite, même à l'heure de pointe.</p></li>
            <li className="value"><Icon name="flame" /><h3 className="value__title">Le goût authentique</h3><p>Viande marinée, galette fine roulée minute, crème d'ail maison : la recette, sans raccourci.</p></li>
            <li className="value value--dark"><Icon name="pin" /><h3 className="value__title">En face de l'UAC</h3><p>Facile à trouver, ouvert 7j/7 jusqu'à 01h00 du matin, livraison dans Calavi.</p></li>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <Reveal as="h2" className="title-xl">Deux façons de s'installer</Reveal>
          <div className="duo">
            <Reveal><p className="emoji" aria-hidden="true">🍽️</p><h3>Espace Terrasse / Fast-Food</h3><p>Idéal pour manger rapidement en face de l'université. Ambiance animée, service au rythme des étudiants.</p></Reveal>
            <Reveal className="is-dark" style={{ ['--d' as string]: '.1s' }}><p className="emoji" aria-hidden="true">👑</p><h3>Espace Salon VIP Climatisé</h3><p>Pour des repas plus calmes ou réunions de groupe. Au frais, au calme, idéal pour fêter ou travailler en groupe.</p></Reveal>
          </div>
          <Reveal className="about-ctas">
            <Link to="/reservation" className="btn btn--red">Réserver une table</Link>
            <Link to="/menu" className="btn btn--outline">Commander en ligne</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

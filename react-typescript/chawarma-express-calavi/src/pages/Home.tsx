import { Link } from 'react-router';
import { MAPS_URL, SITE } from '../config/site.ts';
import { FEATURED, TICKET } from '../data/menu.ts';
import { AddButton, Badge, Price } from '../components/AddButton.tsx';
import { Checker, Heading } from '../components/Heading.tsx';
import { Icon } from '../components/Icon.tsx';
import { MapEmbed } from '../components/MapEmbed.tsx';
import { HoursTable, OpenStatus } from '../components/OpenStatus.tsx';
import { Reveal } from '../components/Reveal.tsx';
import { Seo } from '../components/Seo.tsx';

/** Données structurées « Restaurant » (moteurs de recherche). */
const JSON_LD = {
  '@context': 'https://schema.org', '@type': 'Restaurant', name: SITE.name, description: SITE.description, telephone: SITE.phoneTel,
  priceRange: 'FCFA', servesCuisine: ['Chawarma', 'Fast-food'],
  address: { '@type': 'PostalAddress', streetAddress: "En face de l'Université d'Abomey-Calavi (UAC), route inter-états", addressLocality: 'Abomey-Calavi', addressCountry: 'Bénin' },
  openingHoursSpecification: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    .map((d) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: `https://schema.org/${d}`, opens: SITE.open, closes: SITE.close })),
};

const PERKS = [
  { icon: 'chat', title: 'Commande WhatsApp', text: 'Panier en ligne, message prêt à envoyer.' },
  { icon: 'bike', title: 'Livraison à Calavi', text: 'Tarif confirmé selon votre quartier.' },
  { icon: 'clock', title: 'Ouvert 7j/7', text: 'De 11h00 – 01h00, même tard le soir.' },
] as const;

export function Home() {
  return (
    <>
      <Seo />
      {/* Texte JSON produit par JSON.stringify depuis des constantes : React l'insère comme texte, sans HTML. */}
      <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>

      {/* ============ HÉRO ============ */}
      <section className="hero">
        <div className="hero__glow" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero-rise">
            <p className="pill"><span className="dot" aria-hidden="true" />En face de l'UAC · Abomey-Calavi</p>
            <h1 className="hero__title">Chaud, roulé,<br /><span>servi express.</span></h1>
            <p className="hero__lead">{SITE.slogan} Commandez en ligne, on prépare, vous récupérez — ou on livre.</p>
            <div className="hero__ctas">
              <Link to="/menu" className="btn btn--red">Voir le menu &amp; commander <Icon name="arrowRight" /></Link>
              <Link to="/reservation" className="btn btn--light">Réserver une table</Link>
            </div>
            <OpenStatus className="status--hero" />
          </div>
          <div className="ticket hero-rise hero-rise--late">
            <div className="ticket__shadow" aria-hidden="true" />
            <div className="ticket__card">
              <div className="ticket__head"><p className="ticket__title">Les plus demandés</p><span className="ticket__num">Ticket n°1</span></div>
              <ul className="ticket__list">
                {TICKET.map((d) => (
                  <li key={d.id}>
                    <div className="grow"><p className="ticket__name">{d.nom}</p><Price dish={d} small /> <Badge dish={d} /></div>
                    <AddButton dish={d} />
                  </li>
                ))}
              </ul>
              <Link to="/menu" className="ticket__more">Toute la carte <Icon name="arrowRight" className="ico--sm" /></Link>
            </div>
          </div>
        </div>
        <Checker />
      </section>

      {/* ============ ATOUTS ============ */}
      <section className="perks">
        <Reveal as="ul" kind="stagger" className="container perks__list">
          {PERKS.map((p) => (
            <li key={p.title} className="perks__item">
              <span className="perks__ico"><Icon name={p.icon} /></span>
              <div><p className="perks__title">{p.title}</p><p className="muted">{p.text}</p></div>
            </li>
          ))}
        </Reveal>
      </section>

      {/* ============ INCONTOURNABLES ============ */}
      <section className="section bg-white">
        <div className="container">
          <div className="featured__top">
            <Heading eyebrow="Au comptoir" title="Les incontournables" sub="Ce que les étudiants et les habitués commandent le plus." />
            <Reveal as={Link} to="/menu" className="link-arrow">Tout le menu <Icon name="arrowRight" className="ico--sm" /></Reveal>
          </div>
          <Reveal as="ul" kind="stagger" className="featured__grid">
            {FEATURED.map((d, i) => (
              <li key={d.id} className={`fcard${i === 0 ? ' fcard--hero' : ''}`}>
                <p className="fcard__tag">{d.badge ? <Badge dish={d} /> : d.categorie}</p>
                <h3 className="fcard__name">{d.nom}</h3>
                <p className="fcard__desc">{d.desc}</p>
                <div className="fcard__foot"><Price dish={d} /><AddButton dish={d} /></div>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ============ DEUX ESPACES ============ */}
      <section className="section bg-muted">
        <div className="container">
          <Heading eyebrow="Sur place" title="Deux espaces, deux rythmes" sub="Un repas rapide entre deux cours, ou un moment au calme au frais." />
          <div className="spaces">
            <Reveal className="space">
              <span className="emoji" aria-hidden="true">🍽️</span>
              <h3 className="space__title">Espace Terrasse / Fast-Food</h3>
              <p className="space__text">Idéal pour manger rapidement en face de l'université. On commande au comptoir, on s'installe, c'est servi.</p>
              <Link to="/reservation?espace=terrasse" className="btn btn--red btn--bold btn--static">Réserver en terrasse <Icon name="arrowRight" /></Link>
            </Reveal>
            <Reveal className="space space--vip" style={{ ['--d' as string]: '.1s' }}>
              <span className="emoji" aria-hidden="true">👑</span>
              <h3 className="space__title">Espace Salon VIP Climatisé</h3>
              <p className="space__text">Pour des repas plus calmes ou réunions de groupe : anniversaires, révisions en groupe, rendez-vous pro.</p>
              <Link to="/reservation?espace=vip" className="btn btn--yellow btn--static">Réserver le salon VIP <Icon name="arrowRight" /></Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ INFOS PRATIQUES ============ */}
      <div id="infos" style={{ scrollMarginTop: '4rem' }}>
        <section className="section" id="localisation">
          <div className="container loc">
            <div>
              <Heading title="En face de l'UAC" />
              <Reveal>
                <p className="loc__addr"><Icon name="pin" /><span>{SITE.address}</span></p>
                <ul className="loc__marks"><li>Juste en face de l'entrée de l'UAC</li><li>Au bord de la route inter-états</li></ul>
                <a href={MAPS_URL} className="btn" target="_blank" rel="noopener noreferrer"><Icon name="navigation" /> Itinéraire Google Maps</a>
              </Reveal>
            </div>
            <MapEmbed />
          </div>
        </section>
        <section className="section bg-muted" id="horaires">
          <div className="container hours">
            <div>
              <Heading title="Horaires" sub="Heure du Bénin." />
              <OpenStatus reveal />
            </div>
            <Reveal style={{ ['--d' as string]: '.1s' }}><HoursTable /></Reveal>
          </div>
        </section>
      </div>

      {/* ============ APPEL FINAL ============ */}
      <section className="final">
        <div className="container final__inner">
          <p className="final__title">Une faim entre deux cours ?</p>
          <Link to="/menu" className="btn btn--light">Commander maintenant <Icon name="arrowRight" /></Link>
        </div>
      </section>
    </>
  );
}

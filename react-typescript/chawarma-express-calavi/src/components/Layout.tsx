import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { HELLO_MESSAGE, MAPS_URL, NAV, SITE, waLink } from '../config/site.ts';
import { useCart } from '../cart/CartContext.tsx';
import { Icon } from './Icon.tsx';
import { Checker } from './Heading.tsx';

/** Logo « CE » + nom (en-tête et pied de page). */
function Brand() {
  return (
    <Link to="/" className="brand" aria-label={`${SITE.name}, accueil`}>
      <span className="brand__mark" aria-hidden="true">CE</span>
      <span className="brand__text"><span className="brand__name">{SITE.shortName}</span><span className="brand__city">{SITE.city}</span></span>
    </Link>
  );
}

/** Lien de navigation : « page courante » seulement pour la route exacte (pas pour l'ancre « Nous trouver »). */
function NavItem({ to, label, className }: { to: string; label: string; className: string }) {
  if (to.includes('#')) return <Link to={to} className={className}>{label}</Link>;
  return <NavLink to={to} end className={className}>{label}</NavLink>;
}

function CartButton() {
  const { count } = useCart();
  const [pop, setPop] = useState(false);
  const last = useRef(count);
  useEffect(() => {
    if (count !== last.current && count > 0) {
      setPop(false);
      requestAnimationFrame(() => setPop(true)); // relance l'animation du badge
    }
    last.current = count;
  }, [count]);
  return (
    <Link to="/commander" className="icon-btn cart-btn" aria-label={count ? `Mon panier, ${count} article${count > 1 ? 's' : ''}` : 'Mon panier, vide'}>
      <Icon name="bag" className="ico--lg" />
      <span className={`cart-badge${pop ? ' is-pop' : ''}`} aria-hidden="true" hidden={count === 0}>{count > 99 ? '99+' : count}</span>
    </Link>
  );
}

/** Menu latéral mobile : focus sur « Fermer » à l'ouverture, Échap pour fermer, fermé au passage en grand écran. */
function Drawer({ open, onClose }: { open: boolean; onClose: (focusBurger: boolean) => void }) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const t = setTimeout(() => setMounted(false), 350);
    return () => clearTimeout(t);
  }, [open]);
  useEffect(() => { if (open && mounted) closeBtn.current?.focus(); }, [open, mounted]);
  useEffect(() => {
    document.body.classList.toggle('no-scroll', open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(true); };
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = (e: MediaQueryListEvent) => { if (e.matches) onClose(false); };
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => { document.removeEventListener('keydown', onKey); mq.removeEventListener('change', onMq); };
  }, [open, onClose]);

  return (
    <>
      <div className={`drawer-overlay${visible ? ' is-open' : ''}`} hidden={!mounted} onClick={() => onClose(false)} />
      <div className={`drawer${visible ? ' is-open' : ''}`} id="drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title" hidden={!mounted}
        onClick={(e) => { if ((e.target as HTMLElement).closest('a')) onClose(false); }}>
        <div className="drawer__head">
          <p className="drawer__title" id="drawer-title">{SITE.shortName}</p>
          <p className="drawer__desc">{SITE.slogan}</p>
          <button type="button" ref={closeBtn} className="icon-btn drawer__close" aria-label="Fermer le menu" onClick={() => onClose(true)}><Icon name="close" /></button>
        </div>
        <nav className="drawer__nav" aria-label="Navigation mobile">
          <ul>{NAV.map((n) => <li key={n.to}><NavItem to={n.to} label={n.label} className="drawer__link" /></li>)}</ul>
        </nav>
        <div className="drawer__actions">
          <Link to="/menu" className="is-red">Commander maintenant</Link>
          <a href={`tel:${SITE.phoneTel}`} className="is-outline"><Icon name="phone" /> {SITE.phoneDisplay}</a>
          <a href={waLink(HELLO_MESSAGE)} className="is-wa" target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" /> WhatsApp</a>
        </div>
      </div>
    </>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const close = useRef((focusBurger: boolean) => {
    setOpen(false);
    if (focusBurger) burger.current?.focus();
  }).current;
  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <Brand />
          <nav className="nav" aria-label="Navigation principale">
            <ul className="nav__list">{NAV.map((n) => <li key={n.to}><NavItem to={n.to} label={n.label} className="nav__link" /></li>)}</ul>
          </nav>
          <div className="header__actions">
            <Link to="/menu" className="header__cta">Commander</Link>
            <CartButton />
            <button type="button" ref={burger} className="icon-btn burger" aria-label="Ouvrir le menu" aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(true)}>
              <Icon name="menu" className="ico--lg" />
            </button>
          </div>
        </div>
      </header>
      <Drawer open={open} onClose={close} />
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <Checker />
      <div className="container footer__grid">
        <div><Brand /><p className="footer__slogan">{SITE.slogan}</p></div>
        <nav className="footer__col" aria-label="Pied de page">
          <p className="footer__heading">Navigation</p>
          <ul>
            {NAV.map((n) => <li key={n.to}><Link to={n.to}>{n.label}</Link></li>)}
            <li><Link to="/commander">Mon panier</Link></li>
          </ul>
        </nav>
        <div className="footer__col">
          <p className="footer__heading">Nous trouver</p>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="footer__addr">{SITE.address}</a>
          <a href={`tel:${SITE.phoneTel}`} style={{ marginTop: '.5rem' }}>{SITE.phoneDisplay}</a>
          <a href={waLink(HELLO_MESSAGE)} target="_blank" rel="noopener noreferrer">Commander sur WhatsApp</a>
        </div>
        <div className="footer__col">
          <p className="footer__heading">Horaires</p>
          <p>Ouvert 7j/7</p>
          <p className="tnum">De 11h00 à 01h00 du matin</p>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {SITE.name} · Abomey-Calavi, Bénin</p>
        <Link to="/mentions-legales">Mentions légales</Link>
      </div>
    </footer>
  );
}

/** Notification « … ajouté au panier » (4 s), avec un lien vers le panier. */
function Toast() {
  const { lastAdded } = useCart();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!lastAdded) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => setVisible(false), 4000);
    return () => { cancelAnimationFrame(raf); clearTimeout(t); };
  }, [lastAdded]);
  if (!lastAdded) return null;
  return (
    <div className={`toast${visible ? ' is-visible' : ''}`} role="status">
      <Icon name="checkCircle" className="ico--sm" />
      <span className="toast__text">{lastAdded.nom} ajouté au panier</span>
      <Link className="toast__action" to="/commander">Voir le panier</Link>
    </div>
  );
}

/** En haut de page à chaque changement de page ; défilement jusqu'à l'ancre (ex. /#infos). */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) { el.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash, key]);
  return null;
}

export function Layout({ children, waFloat = true }: { children: ReactNode; waFloat?: boolean }) {
  return (
    <>
      <ScrollManager />
      <a className="skip" href="#contenu">Aller au contenu</a>
      <Header />
      <main id="contenu">{children}</main>
      <Footer />
      {waFloat && (
        <a href={waLink(HELLO_MESSAGE)} className="wa-float" target="_blank" rel="noopener noreferrer" aria-label="Commander sur WhatsApp">
          <Icon name="whatsapp" /><span>Commander</span>
        </a>
      )}
      <Toast />
    </>
  );
}

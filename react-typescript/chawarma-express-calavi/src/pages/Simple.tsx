import { Link } from 'react-router';
import { SITE } from '../config/site.ts';
import { Seo } from '../components/Seo.tsx';

export function Legal() {
  return (
    <>
      <Seo title="Mentions légales" />
      <section className="simple">
        <h1>Mentions légales</h1>
        <div className="simple__body">
          <p><strong>{SITE.name}</strong> — {SITE.address}</p>
          <p>Téléphone / WhatsApp : {SITE.phoneDisplay}</p>
          <p>Ce site ne collecte aucune donnée personnelle et n'utilise pas de cookies de suivi. Le contenu du panier est conservé uniquement dans votre navigateur (stockage local) ; vos commandes et réservations sont transmises par WhatsApp, à votre initiative.</p>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  return (
    <>
      <Seo title="Page introuvable" />
      <meta name="robots" content="noindex" />
      <section className="simple" style={{ textAlign: 'center' }}>
        <p className="eyebrow">Erreur 404</p>
        <h1>Cette page n'existe pas</h1>
        <div className="simple__body">
          <p>Le lien est peut-être ancien. Le menu, lui, est toujours là.</p>
          <p><Link to="/" className="btn btn--red">Retour à l'accueil</Link></p>
        </div>
      </section>
    </>
  );
}

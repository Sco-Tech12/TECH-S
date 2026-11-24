import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ESPACES, PHONE_PATTERN, PHONE_PLACEHOLDER, SITE, waLink, type Espace } from '../config/site.ts';
import { useCart } from '../cart/CartContext.tsx';
import { MAX_QTY, type CartItem } from '../cart/storage.ts';
import { fcfa, oneLine } from '../lib/format.ts';
import { clearInvalid, EspaceChoice, invalidFields, openWhatsApp } from '../components/EspaceChoice.tsx';
import { Checker } from '../components/Heading.tsx';
import { Icon, type IconName } from '../components/Icon.tsx';
import { Seo } from '../components/Seo.tsx';

const MODES = [
  { value: 'Livraison à domicile', icon: 'bike', sub: 'Abomey-Calavi & environs' },
  { value: 'À emporter', icon: 'bag', sub: "Prête au comptoir, en face de l'UAC" },
  { value: 'Sur place', icon: 'utensils', sub: 'Servie à votre table' },
] as const satisfies readonly { value: string; icon: IconName; sub: string }[];
type Mode = (typeof MODES)[number]['value'];

function CartLine({ item, isNew, onLeave }: { item: CartItem; isNew: boolean; onLeave: () => void }) {
  const { setQuantity } = useCart();
  const [leaving, setLeaving] = useState(false);
  return (
    <li className={`cart-item${leaving ? ' is-leaving' : ''}`} style={isNew ? undefined : { animation: 'none' }}>
      <div className="grow">
        <h3 className="cart-item__name">{item.nom}</h3>
        <p className="cart-item__unit">{item.variable ? 'Dès ' : ''}{fcfa(item.prix)} / unité</p>
      </div>
      <p className="cart-item__total">{fcfa(item.prix * item.quantite)}{item.variable ? ' *' : ''}</p>
      <div className="qty" role="group" aria-label={`Quantité de ${item.nom}`}>
        <button type="button" className="qty__btn" aria-label={`Diminuer la quantité de ${item.nom}`} disabled={item.quantite <= 1} onClick={() => setQuantity(item.id, item.quantite - 1)}><Icon name="minus" className="ico--sm" /></button>
        <span className="qty__value"><span className="sr-only">Quantité : </span>{item.quantite}</span>
        <button type="button" className="qty__btn" aria-label={`Augmenter la quantité de ${item.nom}`} disabled={item.quantite >= MAX_QTY} onClick={() => setQuantity(item.id, item.quantite + 1)}><Icon name="plus" className="ico--sm" /></button>
      </div>
      <button type="button" className="cart-item__remove" aria-label={`Supprimer ${item.nom} du panier`} onClick={() => { setLeaving(true); setTimeout(onLeave, 200); }}><Icon name="trash" /></button>
    </li>
  );
}

export function Order() {
  const { items, count, subtotal, hasVariable, remove, clear } = useCart();
  const [mode, setMode] = useState<Mode>('Livraison à domicile');
  const [espace, setEspace] = useState<Espace>('terrasse');
  const [error, setError] = useState('');
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const known = useRef(new Set(items.map((i) => i.id))); // plats déjà affichés : pas d'animation d'entrée
  const form = useRef<HTMLFormElement>(null);
  const nom = useRef<HTMLInputElement>(null);
  const tel = useRef<HTMLInputElement>(null);
  const adresse = useRef<HTMLTextAreaElement>(null);
  const evenement = useRef<HTMLTextAreaElement>(null);

  const has = items.length > 0;
  const delivery = mode === 'Livraison à domicile';
  const surPlace = mode === 'Sur place';
  const vip = surPlace && espace === 'vip';
  const total = fcfa(subtotal) + (hasVariable ? ' *' : '');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!has) return setError('Votre panier est vide.');
    const invalid = invalidFields([nom.current, tel.current, delivery ? adresse.current : null]);
    if (invalid.length) {
      setError('Merci de compléter correctement vos informations (champs signalés).');
      invalid[0]!.focus();
      invalid[0]!.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    setError('');
    const plats = items.map((i) => `- ${i.quantite}x *${i.nom}* (${i.variable ? 'dès ' : ''}${fcfa(i.prix * i.quantite)})`).join('\n');
    const lines: string[] = surPlace ? [ESPACES[espace].alert, ''] : [];
    lines.push(
      `🛒 *NOUVELLE COMMANDE EN LIGNE - ${SITE.name}*`, '', '*Détails des plats :*', plats, '',
      `*Total Commande :* ${hasVariable ? 'à partir de ' : ''}${fcfa(subtotal)}`, '', '*Infos Client :*',
      `- *Nom :* ${nom.current!.value.trim()}`, `- *Téléphone :* ${tel.current!.value.trim()}`, `- *Mode :* ${mode}`,
    );
    if (delivery) lines.push(`- *Adresse exacte :* ${oneLine(adresse.current!.value)}`);
    if (surPlace) lines.push(`- *Espace :* ${ESPACES[espace].label}`);
    if (vip) lines.push(`- *Occasion :* ${oneLine(evenement.current?.value ?? '') || 'Non précisé'}`);
    lines.push('', `_Merci de me confirmer la prise en compte${delivery ? ' et le tarif de livraison' : ''}${vip ? ' ainsi que la disponibilité du Salon VIP Climatisé' : ''}._`);
    const url = waLink(lines.join('\n'));
    // Panier vidé après commande, puis confirmation avec un lien pour rouvrir WhatsApp.
    clear();
    setSentUrl(url);
    form.current?.reset();
    setMode('Livraison à domicile');
    setEspace('terrasse');
    openWhatsApp(url);
  }

  const shown = items.map((i) => ({ item: i, isNew: !known.current.has(i.id) }));
  useEffect(() => {
    items.forEach((i) => known.current.add(i.id));
    if (items.length) setSentUrl(null); // nouveau panier : la confirmation précédente disparaît
  }, [items]);

  return (
    <>
      <Seo title="Mon panier" description="Votre panier CHAWARMA EXPRESS - CALAVI : livraison, à emporter ou sur place, commande envoyée sur WhatsApp." />
      <section className="bg-dark">
        <div className="container page-head__inner hero-rise">
          <Link to="/menu" className="back"><Icon name="arrowLeft" className="ico--sm" /> Continuer mes achats</Link>
          <p className="page-head__eyebrow">Commande en ligne</p>
          <h1 className="page-head__title">Mon panier</h1>
        </div>
        <Checker />
      </section>
      <div className="bg-white">
        <div className="container order">
          <div className="order__main">
            <section className="card" aria-labelledby="cart-title">
              <div className="card__head">
                <h2 className="card__title" id="cart-title">Votre panier</h2>
                {has && <button type="button" className="link-btn" onClick={() => { if (window.confirm('Vider entièrement votre panier ?')) clear(); }}>Vider le panier</button>}
              </div>
              {has ? (
                <ul className="cart-list" aria-live="polite">
                  {shown.map(({ item, isNew }) => <CartLine key={item.id} item={item} isNew={isNew} onLeave={() => remove(item.id)} />)}
                </ul>
              ) : sentUrl ? (
                <div className="empty">
                  <span className="empty__ok"><Icon name="check" /></span>
                  <p className="empty__title">Commande prête à l'envoi !</p>
                  <p className="empty__text">Envoyez le message dans WhatsApp pour transmettre votre commande. L'équipe vous confirme la prise en charge et, en livraison, le tarif selon votre quartier.</p>
                  <a href={sentUrl} className="btn btn--wa btn--static" target="_blank" rel="noopener noreferrer"><Icon name="whatsapp" /> Rouvrir WhatsApp</a>
                </div>
              ) : (
                <div className="empty">
                  <Icon name="bag" className="empty__ico" />
                  <p className="empty__title">Votre panier est vide</p>
                  <p className="empty__text">Commencez par ajouter des plats depuis le menu.</p>
                  <Link to="/menu" className="btn btn--red btn--bold btn--static">Voir le menu</Link>
                </div>
              )}
            </section>

            <form ref={form} className="card stack" id="form-commande" noValidate hidden={!has} onSubmit={submit} onInput={clearInvalid}>
              <h2 className="card__title">Vos informations</h2>
              <fieldset>
                <legend className="legend">Mode de commande</legend>
                <div className="modes">
                  {MODES.map((m) => (
                    <label key={m.value} className="mode">
                      <input type="radio" name="livraison-mode" value={m.value} checked={mode === m.value} onChange={() => setMode(m.value)} />
                      <span className="mode__ico"><Icon name={m.icon} /></span>
                      <span className="mode__body"><strong>{m.value}</strong><small>{m.sub}</small></span>
                    </label>
                  ))}
                </div>
              </fieldset>
              {surPlace && <EspaceChoice id="commande-espaces" value={espace} onChange={setEspace} />}
              {vip && (
                <div className="field">
                  <label htmlFor="commande-evenement">Occasion ou demande particulière <span className="field__opt">(optionnel)</span></label>
                  <textarea ref={evenement} className="input" id="commande-evenement" rows={2} maxLength={160} placeholder="Anniversaire, réunion de groupe, révisions…" />
                </div>
              )}
              <div className="grid-2">
                <div className="field"><label htmlFor="livraison-nom">Nom complet <abbr title="obligatoire">*</abbr></label><input ref={nom} className="input" type="text" id="livraison-nom" autoComplete="name" required placeholder="Ex. Aïcha Dossou" /></div>
                <div className="field"><label htmlFor="livraison-tel">Numéro WhatsApp <abbr title="obligatoire">*</abbr></label><input ref={tel} className="input" id="livraison-tel" type="tel" inputMode="tel" autoComplete="tel" required placeholder={PHONE_PLACEHOLDER} pattern={PHONE_PATTERN} title={`Numéro béninois à 10 chiffres commençant par 01, ex. ${PHONE_PLACEHOLDER}`} /></div>
              </div>
              {delivery && (
                <div className="field">
                  <label htmlFor="livraison-adresse">Adresse de livraison précise <abbr title="obligatoire">*</abbr></label>
                  <textarea ref={adresse} className="input" id="livraison-adresse" rows={3} required placeholder="Quartier, rue, repères (ex. Zogbadjè, derrière la pharmacie, portail bleu)" />
                </div>
              )}
              {mode === 'À emporter' && <p className="pickup">Retrait au comptoir : {SITE.address}. Ouvert 7j/7 de 11h00 à 01h00.</p>}
            </form>
          </div>

          <aside className="order__side" aria-labelledby="summary-title">
            <div className="summary">
              <h2 className="card__title" id="summary-title">Résumé</h2>
              <dl className="summary__lines">
                <div><dt>Articles</dt><dd>{count}</dd></div>
                <div><dt>Sous-total</dt><dd>{total}</dd></div>
                <div><dt>Livraison</dt><dd className="is-light">{delivery ? 'À définir' : surPlace ? 'Aucuns frais (sur place)' : 'Gratuit (retrait)'}</dd></div>
              </dl>
              <div className="summary__total"><span>Total</span><span>{total}</span></div>
              {hasVariable && <p className="summary__note">* Certains articles ont un prix variable : le montant final vous sera confirmé sur WhatsApp.</p>}
              {delivery && <p className="summary__note">Livraison : tarif confirmé sur WhatsApp selon votre quartier.</p>}
              {error && has && <p className="summary__error" role="alert">{error}</p>}
              <button type="submit" form="form-commande" className="btn btn--red btn--block" disabled={!has}><Icon name="whatsapp" /> Valider la commande</button>
              <p className="summary__foot">La commande s'ouvre dans WhatsApp, prête à envoyer.</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

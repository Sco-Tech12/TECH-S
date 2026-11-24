import { useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ESPACES, PHONE_PATTERN, PHONE_PLACEHOLDER, SITE, waLink, type Espace } from '../config/site.ts';
import { afterMidnight } from '../lib/hours.ts';
import { oneLine } from '../lib/format.ts';
import { clearInvalid, EspaceChoice, invalidFields, openWhatsApp } from '../components/EspaceChoice.tsx';
import { Checker } from '../components/Heading.tsx';
import { Icon } from '../components/Icon.tsx';
import { Reveal } from '../components/Reveal.tsx';
import { Seo } from '../components/Seo.tsx';

const PEOPLE = [...Array.from({ length: 10 }, (_, i) => `${i + 1} personne${i ? 's' : ''}`), 'Plus de 10 personnes (groupe)'];
const isoDay = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const hhmm = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
const formatDate = (iso: string) => {
  const [y = 0, m = 1, d = 1] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

export function Reservation() {
  const [params] = useSearchParams();
  // Espace pré-choisi depuis l'accueil (?espace=vip)
  const [espace, setEspace] = useState<Espace>(params.get('espace') === 'vip' ? 'vip' : 'terrasse');
  const [error, setError] = useState('');
  const today = isoDay(new Date());
  const refs = {
    nom: useRef<HTMLInputElement>(null), tel: useRef<HTMLInputElement>(null), date: useRef<HTMLInputElement>(null),
    heure: useRef<HTMLInputElement>(null), personnes: useRef<HTMLSelectElement>(null), demandes: useRef<HTMLTextAreaElement>(null),
    evenement: useRef<HTMLTextAreaElement>(null),
  };

  /** Heure en dehors des horaires, ou déjà passée aujourd'hui. */
  function hoursError(): string {
    const h = refs.heure.current!.value;
    const d = refs.date.current!.value;
    if (!h || !d) return '';
    if (h < SITE.open && !afterMidnight(h)) return `Nous vous accueillons 7j/7 de ${SITE.open.replace(':', 'h')} à ${SITE.close.replace(':', 'h')} du matin.`;
    if (d === today && !afterMidnight(h) && h < hhmm(new Date())) return 'Cette heure est déjà passée, merci d\'en choisir une autre.';
    return '';
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const heure = refs.heure.current!;
    const invalid = invalidFields([refs.nom.current, refs.tel.current, refs.date.current, heure, refs.personnes.current]);
    const onlyTime = invalid.length === 1 && invalid[0] === heure && heure.value;
    const message = invalid.length && !onlyTime ? 'Merci de compléter correctement les champs signalés.' : hoursError();
    if (!invalid.length && message) invalid.push(heure);
    heure.classList.toggle('is-invalid', invalid.includes(heure));
    if (message) {
      setError(message);
      invalid[0]?.focus();
      return;
    }
    setError('');
    const vip = espace === 'vip';
    const lines = [ESPACES[espace].alert, '', `Bonjour ${SITE.name}, je souhaite effectuer une réservation :`, `- *Espace :* ${ESPACES[espace].label}`];
    if (vip) lines.push(`- *Occasion :* ${oneLine(refs.evenement.current?.value ?? '') || 'Non précisé'}`);
    lines.push(
      `- *Nom :* ${refs.nom.current!.value.trim()}`,
      `- *Téléphone :* ${refs.tel.current!.value.trim()}`,
      `- *Date :* ${formatDate(refs.date.current!.value)}`,
      `- *Heure :* ${heure.value.replace(':', 'h')}${afterMidnight(heure.value) ? ' (dans la nuit, après minuit)' : ''}`,
      `- *Nombre de places :* ${refs.personnes.current!.value}`,
      `- *Demandes spéciales :* ${oneLine(refs.demandes.current!.value) || 'Aucune'}`,
    );
    openWhatsApp(waLink(lines.join('\n')));
  }

  return (
    <>
      <Seo title="Réserver une table" description="Réservez chez CHAWARMA EXPRESS - CALAVI, en face de l'UAC : Espace Terrasse / Fast-Food ou Espace Salon VIP Climatisé. Confirmation directe sur WhatsApp." />
      <section className="bg-dark">
        <div className="container page-head__inner hero-rise">
          <Link to="/" className="back"><Icon name="arrowLeft" className="ico--sm" /> Retour à l'accueil</Link>
          <p className="page-head__eyebrow">Réservation</p>
          <h1 className="page-head__title">Votre table vous attend</h1>
          <p className="page-head__lead">Quelques champs, et votre demande part sur WhatsApp. Confirmation rapide, sans attente au téléphone.</p>
        </div>
        <Checker />
      </section>
      <div className="bg-muted">
        <div className="container resa">
          <Reveal className="resa__aside">
            <h2 className="resa__aside-title">Deux espaces au choix</h2>
            <ul className="resa__spaces">
              {(Object.keys(ESPACES) as Espace[]).map((k) => (
                <li key={k}><span className="emoji" aria-hidden="true">{ESPACES[k].emoji}</span><span><strong>{ESPACES[k].title}</strong><span className="muted">{ESPACES[k].text}</span></span></li>
              ))}
            </ul>
            <ul className="resa__checks">
              <li><Icon name="check" /> Anniversaires, réunions et groupes</li>
              <li><Icon name="check" /> Réponse directe de l'équipe</li>
              <li><Icon name="check" /> Ouvert 7j/7 · 11h00 – 01h00</li>
            </ul>
          </Reveal>
          <form className="card card--lg card--shadow stack" id="form-reservation" noValidate onSubmit={submit} onInput={clearInvalid}>
            <h2 className="form-title"><span className="form-title__ico"><Icon name="calendarCheck" /></span>Formulaire de réservation</h2>
            <p className="wa-note"><strong>Réservation via WhatsApp.</strong> Après validation, votre demande s'ouvre dans WhatsApp : il suffit de l'envoyer à notre équipe.</p>
            <EspaceChoice id="resa-espaces" value={espace} onChange={setEspace} />
            {espace === 'vip' && (
              <div className="field">
                <label htmlFor="evenement">Occasion ou demande particulière <span className="field__opt">(optionnel)</span></label>
                <textarea ref={refs.evenement} className="input" id="evenement" rows={2} maxLength={160} placeholder="Anniversaire, réunion de groupe, révisions…" />
              </div>
            )}
            <div className="grid-2">
              <div className="field"><label htmlFor="nom">Nom complet <abbr title="obligatoire">*</abbr></label><input ref={refs.nom} className="input" type="text" id="nom" name="nom" autoComplete="name" required placeholder="Ex. Aïcha Dossou" /></div>
              <div className="field"><label htmlFor="telephone">Téléphone <abbr title="obligatoire">*</abbr></label><input ref={refs.tel} className="input" id="telephone" name="telephone" type="tel" inputMode="tel" autoComplete="tel" required placeholder={PHONE_PLACEHOLDER} pattern={PHONE_PATTERN} title={`Numéro béninois à 10 chiffres commençant par 01, ex. ${PHONE_PLACEHOLDER}`} /></div>
            </div>
            <div>
              <div className="grid-2 grid-2--always">
                <div className="field"><label htmlFor="date">Date <abbr title="obligatoire">*</abbr></label><input ref={refs.date} className="input" type="date" id="date" name="date" required min={today} defaultValue={today} /></div>
                <div className="field"><label htmlFor="heure">Heure <abbr title="obligatoire">*</abbr></label><input ref={refs.heure} className="input" type="time" id="heure" name="heure" required step={900} defaultValue="19:30" /></div>
              </div>
              <p className="hint">Ouvert 7j/7 de 11h00 à 01h00 du matin</p>
            </div>
            <div className="field"><label htmlFor="personnes">Nombre de personnes <abbr title="obligatoire">*</abbr></label>
              <select ref={refs.personnes} className="input" id="personnes" name="personnes" required defaultValue="2 personnes">{PEOPLE.map((p) => <option key={p} value={p}>{p}</option>)}</select>
            </div>
            <div className="field"><label htmlFor="demandes">Demandes spéciales</label><textarea ref={refs.demandes} className="input" id="demandes" name="demandes" rows={3} placeholder="Allergies, placement, gâteau d'anniversaire…" /></div>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="btn btn--red btn--block"><Icon name="whatsapp" /> Valider la réservation</button>
            <p className="legal"><abbr title="obligatoire">*</abbr> Champs obligatoires</p>
          </form>
        </div>
      </div>
    </>
  );
}

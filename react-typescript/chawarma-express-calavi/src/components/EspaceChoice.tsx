import { ESPACES, type Espace } from '../config/site.ts';

/** Choix de l'espace sur place (terrasse ou salon VIP), partagé par la réservation et la commande. */
export function EspaceChoice({ value, onChange, id }: { value: Espace; onChange: (v: Espace) => void; id: string }) {
  return (
    <fieldset className="espaces" id={id}>
      <legend className="legend">Type de réservation</legend>
      <div className="choices">
        {(Object.keys(ESPACES) as Espace[]).map((k) => (
          <label key={k} className={`choice${k === 'vip' ? ' choice--vip' : ''}`}>
            <input type="radio" name={`${id}-type`} value={k} checked={value === k} onChange={() => onChange(k)} />
            <span className="emoji" aria-hidden="true">{ESPACES[k].emoji}</span>
            <span className="choice__body"><strong>{ESPACES[k].title}</strong><small>{ESPACES[k].text}</small></span>
            <span className="choice__radio" aria-hidden="true" />
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Valide des champs avec les règles natives du navigateur ; marque les champs invalides (classe is-invalid). */
export function invalidFields(fields: (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)[]) {
  return fields.filter((f): f is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement => {
    if (!f) return false;
    const bad = !f.value.trim() || !f.checkValidity();
    f.classList.toggle('is-invalid', bad);
    return bad;
  });
}

/** Retire la marque d'erreur dès que la personne corrige le champ. */
export const clearInvalid = (e: React.FormEvent<HTMLFormElement>) => {
  const t = e.target as HTMLElement;
  if (t.classList.contains('is-invalid')) t.classList.remove('is-invalid');
};

/** Ouvre WhatsApp dans un nouvel onglet (repli sur la même page si la fenêtre est bloquée). */
export function openWhatsApp(url: string): void {
  const win = window.open(url, '_blank');
  if (!win) window.location.href = url;
}

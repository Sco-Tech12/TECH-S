import { useEffect, useState } from 'react';
import { beninNow, openStatus, WEEK } from '../lib/hours.ts';
import { SITE } from '../config/site.ts';
import { Reveal } from './Reveal.tsx';

/** Heure du Bénin relue toutes les 30 s (statut ouvert/fermé, jour courant). */
function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function OpenStatus({ className = '', reveal = false }: { className?: string; reveal?: boolean }) {
  const s = openStatus(useNow());
  const cls = `status${className ? ` ${className}` : ''}${s.open ? ' is-open' : ''}`;
  const content = <><span className="dot" aria-hidden="true" />{s.label}</>;
  // aria-live : le changement ouvert/fermé est annoncé aux lecteurs d'écran.
  return reveal
    ? <Reveal as="p" className={cls}><span aria-live="polite">{content}</span></Reveal>
    : <p className={cls} aria-live="polite">{content}</p>;
}

export function HoursTable() {
  const today = beninNow(useNow()).day;
  return (
    <table>
      <caption className="sr-only">Horaires d'ouverture</caption>
      <tbody>
        {WEEK.map((day) => (
          <tr key={day} className={day === today ? 'is-today' : undefined} aria-current={day === today ? 'date' : undefined}>
            <th scope="row">{day}{day === today && <span className="sr-only"> (aujourd'hui)</span>}</th>
            <td>{SITE.open} – {SITE.close}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

import { SITE } from '../config/site.ts';

export const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'] as const;
/** Ordre d'affichage du tableau des horaires (du lundi au dimanche). */
export const WEEK = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'] as const;

const toMin = (hhmm: string): number => {
  const [h = '0', m = '0'] = hhmm.split(':');
  return Number(h) * 60 + Number(m);
};

/** Jour et minute actuels à l'heure du Bénin, quel que soit le fuseau de l'appareil. */
export function beninNow(date = new Date()): { day: (typeof DAYS)[number]; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: SITE.timeZone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const idx = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day: DAYS[Math.max(idx, 0)]!, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

/** Ouvert ou fermé maintenant (plage qui passe minuit : ouvert après l'ouverture OU avant la fermeture). */
export function openStatus(date = new Date()): { open: boolean; label: string } {
  const now = beninNow(date).minutes;
  const o = toMin(SITE.open);
  const c = toMin(SITE.close);
  const open = c < o ? now >= o || now < c : now >= o && now < c;
  return open ? { open: true, label: `Ouvert · ferme à ${SITE.close}` } : { open: false, label: `Fermé · ouvre à ${SITE.open}` };
}

/** Heure de réservation après minuit (dans la plage qui déborde sur le lendemain). */
export const afterMidnight = (h: string): boolean => SITE.close < SITE.open && h <= SITE.close;

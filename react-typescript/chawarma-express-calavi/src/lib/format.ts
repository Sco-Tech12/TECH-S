/** 2500 → « 2 500 FCFA » (espace des milliers, comme sur la version HTML). */
export const fcfa = (n: number): string => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA`;

/** Texte saisi sur plusieurs lignes → une seule ligne (message WhatsApp). */
export const oneLine = (s: string): string => s.trim().replace(/\s*\n\s*/g, ', ');

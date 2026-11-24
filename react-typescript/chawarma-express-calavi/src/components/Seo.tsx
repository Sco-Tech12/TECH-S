import { SITE } from '../config/site.ts';

/** Titre et description de la page (React 19 place automatiquement <title> et <meta> dans le <head>). */
export function Seo({ title, description = SITE.description }: { title?: string; description?: string }) {
  return (
    <>
      <title>{title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.slogan}`}</title>
      <meta name="description" content={description} />
    </>
  );
}

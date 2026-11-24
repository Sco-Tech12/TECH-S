import { useState } from 'react';
import { MAPS_EMBED, SITE } from '../config/site.ts';
import { Icon } from './Icon.tsx';
import { Reveal } from './Reveal.tsx';

/** Carte Google Maps chargée seulement au clic (économise environ 1 Mo de données mobiles). */
export function MapEmbed() {
  const [shown, setShown] = useState(false);
  return (
    <Reveal className="map" style={{ ['--d' as string]: '.1s' }}>
      {shown ? (
        <iframe src={MAPS_EMBED} title={`Carte : ${SITE.name}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <button type="button" className="map__btn" onClick={() => setShown(true)}>
          <span className="map__pin"><Icon name="pin" /></span>
          <span className="map__label">Afficher la carte</span>
          <span className="map__hint">Chargée uniquement si vous cliquez</span>
        </button>
      )}
    </Reveal>
  );
}

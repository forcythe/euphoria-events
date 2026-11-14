'use client';

import { OCCASIONS, GALLERIES, SERVICE_IMAGES, FEATURED } from '@/lib/data';
import { Btn, Split, scrollToId, cld, mediaKey, photoByCaption } from './ui';

/* ------------------------------------------------------------------------ */
/* Occasions strip, speed follows the scroll                                 */
/* ------------------------------------------------------------------------ */
export function Occasions() {
  const chips = hidden => (
    <div className="marq-set" aria-hidden={hidden || undefined}>
      {OCCASIONS.map(o => <span key={o} className="chip"><i aria-hidden="true" />{o}</span>)}
    </div>
  );
  return (
    <div className="marq" role="region" aria-label="Occasions we cover">
      <div className="marq-in" data-marq="40">{chips(false)}{chips(true)}</div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 360° ring: a cylinder of photos that turns one full revolution on scroll   */
/* ------------------------------------------------------------------------ */
// Twelve different event photos (clips skipped, each file once); service photos only fill gaps.
const RING = (() => {
  const featured = new Set([...FEATURED.heroFan, ...FEATURED.about]);
  const seen = new Set();
  const pool = [
    ...Object.values(GALLERIES).flatMap(g => g.media.filter(m => m.type !== 'video' && !featured.has(m.caption)).map(m => m.url)),
    SERVICE_IMAGES['360'], SERVICE_IMAGES.smile, SERVICE_IMAGES.guestbook, SERVICE_IMAGES.video,
  ];
  return pool.filter(u => { const k = mediaKey(u); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 12);
})();

export function Spin() {
  const step = 360 / RING.length;
  return (
    <section className="spin" id="spin" data-label="360°" data-tint="violet" aria-labelledby="spin-h">
      <div className="spin-stage" id="spinStage">
        <div className="spin-head wrap">
          <h2 id="spin-h" className="disp split"><Split text="Every angle." /> <Split text="Every guest." /></h2>
        </div>
        <div className="ring-wrap" id="ringWrap" data-cur="Drag">
          <div className="ring" id="ring" style={{ '--n': RING.length }}>
            {RING.map((src, i) => (
              <figure key={i} className="ring-card ph" style={{ transform: `rotateY(${i * step}deg) translateZ(var(--r))` }}>
                <img src={cld(src, 720, { ar: '3:4' })} alt="" loading="lazy" draggable="false" />
              </figure>
            ))}
          </div>
        </div>
        <div className="spin-foot wrap">
          <p className="deg disp" aria-hidden="true"><span id="spinDeg">0</span>°</p>
          <p className="spin-copy">
            The 360° booth circles each guest in slow motion, turning every pose into a clip made for sharing.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */
/* Story                                                                     */
/* ------------------------------------------------------------------------ */
// People enjoying the experience, chosen in data.js (FEATURED.about)
const ABOUT = FEATURED.about.map(c => photoByCaption(GALLERIES, c)).filter(Boolean);

const STORY = 'Euphoria is Lagos’s foremost event experience media house. We design, brand and staff the experiences your guests gather around, from the 360° slow-motion booth to the video guestbook, then deliver every frame as a finished keepsake. You host. We capture.';

export default function Story() {
  return (
    <section className="story" id="about" data-label="About" data-tint="gold" aria-labelledby="story-h">
      <div className="wrap">
        <h2 id="story-h" className="disp split"><Split text="Crafted for hosts who expect more" /></h2>
        <div className="story-grid">
          <div>
            <p className="big" data-fill>
              {STORY.split(' ').map((w, i) => <span key={i} className="wd">{w} </span>)}
            </p>
            <div className="story-actions" data-rv>
              <Btn onClick={() => scrollToId('services')}>See the services</Btn>
              <Btn variant="line" icon={false} onClick={() => scrollToId('gallery')}>Browse the gallery</Btn>
            </div>
          </div>
          <div className="story-cards" id="storyCards" aria-label="Moments from Euphoria events">
            <div className="sc-stage" id="scStage">
              {ABOUT.map((m, i) => (
                <figure key={m.caption} className={`ph ${'abcd'[i]}`} data-card={[40, 90, 140, 180][i]}>
                  <img src={cld(m.url, [1100, 900, 800, 600][i], { ar: ['3:4', '4:5', '1:1', '1:1'][i] })} alt={m.caption} loading="lazy" draggable="false" />
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

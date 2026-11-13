import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Move3d, X, ArrowRight } from 'lucide-react';

const PART_TOGGLES = [
  { id: 'slideDoor', key: 'van3d.slideDoor' },
  { id: 'liftgate', key: 'van3d.liftgate' },
  { id: 'frontDoors', key: 'van3d.frontDoors' },
  { id: 'awning', key: 'van3d.awning' },
];

const VIEWS = ['exterior', 'side', 'rear', 'inside'];

const HOTSPOT_IDS = ['bed', 'rear', 'slide', 'awning', 'light', 'camp'];

// What each hotspot opens and where it moves the camera
const HOTSPOT_ACTIONS = {
  bed: { open: ['liftgate'], view: 'inside' },
  rear: { open: ['liftgate'], view: 'rear' },
  slide: { open: ['slideDoor'], view: 'side' },
  awning: { open: ['awning'], view: 'side' },
  light: { light: true, open: ['liftgate'], view: 'inside' },
  camp: { open: ['awning'], view: 'side' },
};

const PHOTOS = [
  'bed-made', 'camp-awning', 'bed-rear', 'camp-side',
  'rear-storage', 'sleeping-bags', 'rear-open', 'camp-night',
];

function ToggleButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3.5 py-2 rounded-md border text-sm transition-colors ${
        active
          ? 'bg-stone-900 border-stone-900 text-stone-50'
          : 'bg-white border-stone-300 text-stone-700 hover:border-stone-900'
      }`}
    >
      {children}
    </button>
  );
}

export default function VanTourPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const mountRef = useRef(null);
  const apiRef = useRef(null);
  const hotspotRefs = useRef({});

  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [parts, setParts] = useState({ slideDoor: false, liftgate: false, frontDoors: false, awning: false });
  const [light, setLight] = useState(false);
  const [night, setNight] = useState(false);
  const [view, setView] = useState('exterior');
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    let disposed = false;
    const canvasOk = (() => {
      try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl2') || c.getContext('webgl'));
      } catch {
        return false;
      }
    })();
    if (!canvasOk) {
      setStatus('error');
      return undefined;
    }
    import('../components/van3d/scene.js')
      .then(({ createVanScene }) => {
        if (disposed || !mountRef.current) return;
        const api = createVanScene(mountRef.current);
        api.setHotspotElements(hotspotRefs.current);
        api.onChange(() => {
          setShowHint(false);
          setView(null);
        });
        apiRef.current = api;
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
    return () => {
      disposed = true;
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!photo) return undefined;
    const onKey = (e) => e.key === 'Escape' && setPhoto(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [photo]);

  const togglePart = (id, value) => {
    setParts((prev) => {
      const next = { ...prev, [id]: value ?? !prev[id] };
      apiRef.current?.setPart(id, next[id]);
      return next;
    });
  };

  const changeView = (name) => {
    setView(name);
    setShowHint(false);
    if (name === 'inside') togglePart('liftgate', true);
    apiRef.current?.setView(name);
  };

  const toggleLight = () => {
    const next = !light;
    setLight(next);
    apiRef.current?.setLight(next);
  };

  const toggleNight = () => {
    const next = !night;
    setNight(next);
    apiRef.current?.setNight(next);
  };

  const openHotspot = (id) => {
    const action = HOTSPOT_ACTIONS[id];
    setActiveHotspot(id);
    action.open?.forEach((p) => togglePart(p, true));
    if (action.light && !light) toggleLight();
    if (action.view) changeView(action.view);
  };

  return (
    <div className="pt-24 md:pt-28 pb-20 bg-stone-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        <header className="max-w-2xl">
          <p className="eyebrow mb-3">{t('van3d.badge')}</p>
          <h1 className="font-serif font-medium text-4xl md:text-5xl text-stone-900 tracking-tight">{t('van3d.title')}</h1>
          <p className="mt-4 text-lg text-stone-600 leading-relaxed">{t('van3d.lede')}</p>
        </header>

        {/* Viewer */}
        <section className="mt-10">
          <div
            className={`relative overflow-hidden rounded-md border border-stone-200 aspect-[4/5] sm:aspect-[16/10] transition-colors duration-500 ${
              night ? 'bg-[#1f2633]' : 'bg-gradient-to-b from-stone-100 to-[#e7dfd1]'
            }`}
            dir="ltr"
          >
            <div ref={mountRef} className="absolute inset-0" />

            {/* Hotspots */}
            {HOTSPOT_IDS.map((id) => (
              <button
                key={id}
                type="button"
                ref={(el) => { hotspotRefs.current[id] = el; }}
                onClick={() => openHotspot(id)}
                className="absolute top-0 left-0 opacity-0 transition-opacity duration-200 group"
                aria-label={t(`van3d.hs.${id}.title`)}
                style={{ pointerEvents: 'none' }}
              >
                <span className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow ${activeHotspot === id ? 'bg-stone-900' : 'bg-orange-600'}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded bg-stone-900/85 px-2 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {t(`van3d.hs.${id}.title`)}
                </span>
              </button>
            ))}

            {status === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-stone-500">{t('van3d.loading')}</div>
            )}
            {status === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center p-8 text-center text-stone-600">{t('van3d.noWebgl')}</div>
            )}
            {status === 'ready' && showHint && (
              <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-xs text-stone-700 border border-stone-200">
                <Move3d size={14} /> {t('van3d.hint')}
              </div>
            )}

            {/* Hotspot info card */}
            {activeHotspot && (
              <div className="absolute top-3 left-3 right-3 sm:right-auto sm:max-w-xs rounded-md bg-white/95 border border-stone-200 p-4 shadow-sm" dir={i18n.dir()}>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-lg text-stone-900">{t(`van3d.hs.${activeHotspot}.title`)}</h3>
                  <button type="button" onClick={() => setActiveHotspot(null)} className="text-stone-400 hover:text-stone-900" aria-label="Close">
                    <X size={18} />
                  </button>
                </div>
                <p className="mt-1.5 text-sm text-stone-600 leading-relaxed">{t(`van3d.hs.${activeHotspot}.desc`)}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="eyebrow mb-2.5">{t('van3d.partsTitle')}</p>
              <div className="flex flex-wrap gap-2">
                {PART_TOGGLES.map((p) => (
                  <ToggleButton key={p.id} active={parts[p.id]} onClick={() => togglePart(p.id)}>{t(p.key)}</ToggleButton>
                ))}
                <ToggleButton active={light} onClick={toggleLight}>{t('van3d.light')}</ToggleButton>
                <ToggleButton active={night} onClick={toggleNight}>{t('van3d.night')}</ToggleButton>
              </div>
            </div>
            <div>
              <p className="eyebrow mb-2.5">{t('van3d.viewsTitle')}</p>
              <div className="flex flex-wrap gap-2">
                {VIEWS.map((v) => (
                  <ToggleButton key={v} active={view === v} onClick={() => changeView(v)}>{t(`van3d.view.${v}`)}</ToggleButton>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-stone-500">{t('van3d.disclaimer')}</p>
        </section>

        {/* Real photos */}
        <section className="mt-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="font-serif text-3xl text-stone-900">{t('van3d.photosTitle')}</h2>
              <p className="mt-2 text-stone-600">{t('van3d.photosSub')}</p>
            </div>
            <button type="button" onClick={() => navigate('/plans')} className="btn btn-ghost self-start md:self-auto">
              {t('van3d.equipLink')} <ArrowRight size={16} className="rtl:rotate-180" />
            </button>
          </div>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {PHOTOS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setPhoto(name)}
                className="block overflow-hidden rounded-md border border-stone-200 bg-stone-200 aspect-[3/4]"
              >
                <img
                  src={`/images/van/${name}.webp`}
                  alt={t(`van3d.photoAlt.${name}`)}
                  loading="lazy"
                  className="h-full w-full object-cover transition-opacity hover:opacity-90"
                />
              </button>
            ))}
          </div>
        </section>

        <section className="mt-16 flex flex-col sm:flex-row sm:items-center gap-4 border-t border-stone-200 pt-8">
          <p className="text-stone-700 flex-1">{t('van3d.ctaText')}</p>
          <button type="button" onClick={() => navigate('/booking')} className="btn btn-accent">
            {t('van3d.ctaBooking')} <ArrowRight size={16} className="rtl:rotate-180" />
          </button>
        </section>
      </div>

      {/* Photo lightbox */}
      {photo && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-950/90 p-4"
          onClick={() => setPhoto(null)}
          role="dialog"
          aria-modal="true"
        >
          <img
            src={`/images/van/${photo}.webp`}
            alt={t(`van3d.photoAlt.${photo}`)}
            className="max-h-full max-w-full rounded-md"
          />
          <button type="button" className="absolute top-4 end-4 text-white/80 hover:text-white" aria-label="Close">
            <X size={28} />
          </button>
        </div>
      )}
    </div>
  );
}

import { useState, useCallback, useRef } from 'react'
import TransitionOverlay from './components/TransitionOverlay'
import LandingPage from './components/LandingPage'
import LocationPage from './components/LocationPage'
import VenuePage from './components/VenuePage'
import TelanganaMap from './components/maps/TelanganaMap'
import TamilNaduMap from './components/maps/TamilNaduMap'
import IntroPage, { MuteIcon } from './components/IntroPage'
import templeBg from './assets/temple.png'
import bgMusic from './assets/until_i_found_you.ogg'

function CornerOrnamentSVG() {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 5 L5 60 Q5 5 60 5 Z" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.5" />
      <path d="M12 12 L12 55 Q12 12 55 12 Z" stroke="#D4AF37" strokeWidth="0.7" fill="none" opacity="0.35" />
      <circle cx="5" cy="5" r="3" fill="#D4AF37" opacity="0.5" />
      <circle cx="60" cy="5" r="2" fill="#D4AF37" opacity="0.35" />
      <circle cx="5" cy="60" r="2" fill="#D4AF37" opacity="0.35" />
      <path d="M5 5 Q10 20 20 20 Q10 10 30 5" stroke="#A83228" strokeWidth="0.8" fill="none" opacity="0.4" />
      <path d="M5 5 Q20 10 20 20 Q10 10 5 30" stroke="#A83228" strokeWidth="0.8" fill="none" opacity="0.4" />
    </svg>
  )
}

function BorderDecorations({ isZooming }) {
  return (
    <div className={`fixed inset-0 pointer-events-none z-[100] app-blur-anim ${isZooming ? 'is-zooming' : ''}`}>
      <div className="frame-border" />

      <div className="corner-ornament corner-tl"><CornerOrnamentSVG /></div>
      <div className="corner-ornament corner-tr"><CornerOrnamentSVG /></div>
      <div className="corner-ornament corner-bl"><CornerOrnamentSVG /></div>
      <div className="corner-ornament corner-br"><CornerOrnamentSVG /></div>
    </div>
  )
}

// Pages: 'landing' | 'location' | 'venue'


export default function App() {
  const [page, setPage] = useState('landing')
  const [selectedCity, setCity] = useState(null)
  const [overlayActive, setOverlay] = useState(false)
  const [zoomCity, setZoomCity] = useState(null) // drives the map zoom animation
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 }) // animation origin
  const [isZooming, setIsZooming] = useState(false) // drives the depth of field blur

  // Background music
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [introVisible, setIntroVisible] = useState(true)

  const handleBegin = ({ muted: startMuted }) => {
    if (audioRef.current) {
      audioRef.current.muted = startMuted
      audioRef.current.play().catch(() => {})
    }
    setMuted(startMuted)
    // IntroPage handles its own fade; remove it from DOM after transition
    setTimeout(() => setIntroVisible(false), 700)
  }

  const toggleMute = () => {
    if (audioRef.current) audioRef.current.muted = !muted
    setMuted(m => !m)
  }

  const [zoomScale, setZoomScale] = useState(15) // exact dynamic scale factor to match 75vmin

  const transition = useCallback((callback) => {
    setOverlay(true)
    setTimeout(() => {
      callback()
      window.scrollTo(0, 0)
      setTimeout(() => setOverlay(false), 100)
    }, 380)
  }, [])

  const goToLocation = () => transition(() => setPage('location'))

  const goToVenue = (city, pos) => {
    // Match the zoom end size exactly to the venue page's 75vmin
    const vmin = Math.min(window.innerWidth, window.innerHeight)
    const endSize = vmin * 0.75
    const computedScale = endSize / 56 // 56px is w-14

    // 1. Start zoom animation immediately
    setZoomCity(city)
    setZoomScale(computedScale)
    setIsZooming(true)
    if (pos) setZoomPos(pos)

    // Start fading out the current page wrapper early during zoom
    setTimeout(() => setOverlay(true), 1220)

    // 2. Switch page just before the overlay starts fading (at 80% of the 2s animation = 1600ms)
    //    This ensures LocationPage is NEVER visible through the fading overlay.
    setTimeout(() => {
      setIsZooming(false)
      setCity(city)
      setPage('venue')
      window.scrollTo(0, 0)

      // Complete fade-in of the new VenuePage
      setTimeout(() => setOverlay(false), 100)
    }, 1600)
    // 3. Remove overlay after the fade-out fully completes
    setTimeout(() => setZoomCity(null), 2300)
  }

  const goBack = (target) => transition(() => setPage(target))

  return (
    <>
      {/* Background music */}
      <audio ref={audioRef} src={bgMusic} loop preload="auto" />

      {/* Intro splash */}
      {introVisible && <IntroPage onBegin={handleBegin} />}

      {/* Floating mute button — hidden while intro is showing */}
      {!introVisible && (
        <button
          onClick={toggleMute}
          title={muted ? 'Unmute music' : 'Mute music'}
          aria-label={muted ? 'Unmute music' : 'Mute music'}
          style={{
            position: 'fixed',
            bottom: '1.4rem',
            right: '1.4rem',
            zIndex: 200,
            width: '2.4rem',
            height: '2.4rem',
            borderRadius: '50%',
            border: '1px solid rgba(212,175,55,0.45)',
            background: 'rgba(250,247,242,0.75)',
            backdropFilter: 'blur(6px)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--gold-dark)',
            transition: 'background 0.25s, border-color 0.25s',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          }}
        >
          <MuteIcon muted={muted} />
        </button>
      )}

      <div className={`app-bg app-blur-anim ${isZooming ? 'is-zooming' : ''}`} style={{ backgroundImage: `url(${templeBg})` }} />
      <BorderDecorations isZooming={isZooming} />
      <TransitionOverlay active={overlayActive} />

      {/* Map zoom overlay — lives above all pages */}
      {zoomCity && (
        <div
          className="map-zoom-overlay"
          aria-hidden="true"
          style={{
            '--start-x': `${zoomPos.x}px`,
            '--start-y': `${zoomPos.y}px`,
            '--end-scale': zoomScale
          }}
        >
          <div className="map-zoom-svg-wrapper">
            {zoomCity === 'hyderabad'
              ? <TelanganaMap style={{ color: 'var(--gold-dark)', strokeWidth: 25 }} />
              : <TamilNaduMap style={{ color: 'var(--gold-dark)', strokeWidth: 2.5 }} />
            }
          </div>
        </div>
      )}

      {!introVisible && (
        <main className={`page-transition-wrapper ${overlayActive ? 'fade-out' : ''} ${isZooming ? 'is-zooming' : ''}`}>
          {page === 'landing' && <LandingPage onEnter={goToLocation} />}
          {page === 'location' && <LocationPage onSelectCity={goToVenue} onBack={() => goBack('landing')} />}
          {page === 'venue' && <VenuePage city={selectedCity} onBack={() => goBack('location')} />}
        </main>
      )}
    </>
  )
}

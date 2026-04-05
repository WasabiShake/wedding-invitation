import { useState, useCallback } from 'react'
import TransitionOverlay from './components/TransitionOverlay'
import LandingPage from './components/LandingPage'
import LocationPage from './components/LocationPage'
import VenuePage from './components/VenuePage'
import TelanganaMap from './components/maps/TelanganaMap'
import TamilNaduMap from './components/maps/TamilNaduMap'
import templeBg from './assets/temple.png'

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

function BorderDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
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
    if (pos) setZoomPos(pos)
    
    // Start fading out the current page wrapper early during zoom
    setTimeout(() => setOverlay(true), 1220)

    // 2. Switch page just before the overlay starts fading (at 80% of the 2s animation = 1600ms)
    //    This ensures LocationPage is NEVER visible through the fading overlay.
    setTimeout(() => {
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
      <div className="app-bg" style={{ backgroundImage: `url(${templeBg})` }} />
      <BorderDecorations />
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

      <main className={`page-transition-wrapper ${overlayActive ? 'fade-out' : ''}`}>
        {page === 'landing' && <LandingPage onEnter={goToLocation} />}
        {page === 'location' && <LocationPage onSelectCity={goToVenue} onBack={() => goBack('landing')} />}
        {page === 'venue' && <VenuePage city={selectedCity} onBack={() => goBack('location')} />}
      </main>
    </>
  )
}

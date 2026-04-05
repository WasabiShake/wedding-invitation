import { useState, useCallback } from 'react'
import TransitionOverlay from './components/TransitionOverlay'
import LandingPage from './components/LandingPage'
import LocationPage from './components/LocationPage'
import VenuePage from './components/VenuePage'
import TelanganaMap from './components/maps/TelanganaMap'
import TamilNaduMap from './components/maps/TamilNaduMap'
import CalendarAnimation from './components/CalendarAnimation'

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
    // 2. Switch page just before the overlay starts fading (at 85% of 4.0s = 3400ms)
    setTimeout(() => {
      setCity(city)
      setPage('venue')
      window.scrollTo(0, 0)
    }, 3400)
    // 3. Remove overlay after the fade-out fully completes
    setTimeout(() => setZoomCity(null), 4000)
  }

  const goBack = (target) => transition(() => setPage(target))

  return (
    <>
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
          <CalendarAnimation city={zoomCity} />
        </div>
      )}

      {page === 'landing' && <LandingPage onEnter={goToLocation} />}
      {page === 'location' && <LocationPage onSelectCity={goToVenue} onBack={() => goBack('landing')} />}
      {page === 'venue' && <VenuePage city={selectedCity} onBack={() => goBack('location')} />}
    </>
  )
}

import { useState, useCallback, useRef, useEffect } from 'react'
import TransitionOverlay from './components/TransitionOverlay'
import LandingPage from './components/LandingPage'
import LocationPage from './components/LocationPage'
import VenuePage from './components/VenuePage'
import TelanganaMap from './components/maps/TelanganaMap'
import TamilNaduMap from './components/maps/TamilNaduMap'
import IntroPage, { MuteIcon } from './components/IntroPage'
import templeBg from './assets/temple.png'
import cloudsBg from './assets/grayscale-clouds.png'
import bgMusic from './assets/until_i_found_you.ogg'
import elephantCorner from './assets/corner-elephant.png'
import flowerCorner from './assets/corner-flowers.png'



function Decorations({ isZooming }) {
  return (
    <>
      {/* Background Layer (Behind Temple) */}
      <div className={`fixed inset-0 pointer-events-none app-blur-anim ${isZooming ? 'is-zooming' : ''}`} style={{ zIndex: -14 }}>
        <div className="frame-border" />
      </div>

      {/* Foreground Layer (In front of Temple) */}
      <div className={`fixed inset-0 pointer-events-none app-blur-anim ${isZooming ? 'is-zooming' : ''}`} style={{ zIndex: -9 }}>
        <div className="corner-ornament corner-tl">
          <img src={flowerCorner} alt="" />
        </div>
        <div className="corner-ornament corner-tr">
          <img src={flowerCorner} alt="" />
        </div>
        <div className="corner-ornament corner-bl">
          <img src={elephantCorner} alt="" />
        </div>
        <div className="corner-ornament corner-br">
          <img src={elephantCorner} alt="" />
        </div>
      </div>
    </>
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
  const [assetsLoaded, setAssetsLoaded] = useState(false)

  useEffect(() => {
    const imagesToLoad = [templeBg, cloudsBg, elephantCorner, flowerCorner]
    let loadedCount = 0

    const checkAllLoaded = () => {
      loadedCount++
      if (loadedCount === imagesToLoad.length) {
        if (document.fonts) {
          document.fonts.ready.then(() => setAssetsLoaded(true))
        } else {
          setAssetsLoaded(true)
        }
      }
    }

    imagesToLoad.forEach(src => {
      const img = new Image()
      img.src = src
      img.onload = checkAllLoaded
      img.onerror = checkAllLoaded
    })
  }, [])

  const handleBegin = ({ muted: startMuted }) => {
    if (audioRef.current) {
      audioRef.current.muted = startMuted
      audioRef.current.play().catch(() => { })
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
      {/* Loading Spinner Overlay */}
      {!assetsLoaded && (
        <div className="loading-spinner-overlay">
          <div className="spinner"></div>
          <p className="loading-text">Loading...</p>
        </div>
      )}

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
          className="mute-btn-fixed"
        >
          <MuteIcon muted={muted} />
        </button>
      )}

      <div className={`app-bg app-blur-anim ${isZooming ? 'is-zooming' : ''}`} style={{ backgroundImage: `radial-gradient(circle at bottom center, #ffc000 0%, #ff0030 100%), url(${cloudsBg})` }} />
      <div className={`temple-bg app-blur-anim ${isZooming ? 'is-zooming' : ''}`} style={{ backgroundImage: `url(${templeBg})` }} />
      <Decorations isZooming={isZooming} />
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
              ? <TelanganaMap style={{ color: 'var(--magenta-dark)', strokeWidth: 25 }} />
              : <TamilNaduMap style={{ color: 'var(--magenta-dark)', strokeWidth: 2.5 }} />
            }
          </div>
        </div>
      )}

      {!introVisible && (
        <main className={`page-transition-wrapper ${overlayActive ? 'fade-out' : ''} ${isZooming ? 'is-zooming' : ''}`}>
          {page === 'landing' && <LandingPage onEnter={goToLocation} />}
          {page === 'location' && <LocationPage onSelectCity={goToVenue} onBack={() => goBack('landing')} />}
          {page === 'venue' && <VenuePage city={selectedCity} onBack={() => goBack('location')} onSwitchVenue={(targetCity) => transition(() => setCity(targetCity))} />}
        </main>
      )}
    </>
  )
}

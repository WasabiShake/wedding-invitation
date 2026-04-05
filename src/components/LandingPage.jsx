import { useEffect, useRef } from 'react'
import { GiOakLeaf, GiLotusFlower, GiFlowerEmblem } from 'react-icons/gi'
import { PiStarFourFill } from 'react-icons/pi'

const PETAL_COLORS = ['#D4AF37', '#A83228', '#4E7A30', '#EFB958', '#C9605A', '#8AAD6A']
const KOLAM_COUNT = 14

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

export default function LandingPage({ onEnter }) {
  const petalsRef = useRef(null)
  const kolamLeftRef = useRef(null)
  const kolamRightRef = useRef(null)

  useEffect(() => {
    // Create floating petals
    const container = petalsRef.current
    if (!container) return
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div')
      p.className = 'petal'
      const size = 6 + Math.random() * 8
      const isAlt = Math.random() > 0.5
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * -10}%;
        width: ${size}px;
        height: ${size}px;
        background: ${PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]};
        animation-duration: ${6 + Math.random() * 8}s;
        animation-delay: ${Math.random() * 8}s;
        opacity: 0;
        border-radius: ${isAlt ? '50% 0 50% 0' : '0 50% 0 50%'};
      `
      container.appendChild(p)
    }
    return () => { container.innerHTML = '' }
  }, [])

  useEffect(() => {
    // Build kolam dots
    ;[kolamLeftRef, kolamRightRef].forEach(ref => {
      const el = ref.current
      if (!el) return
      for (let i = 0; i < KOLAM_COUNT; i++) {
        const d = document.createElement('div')
        d.className = 'kolam-dot'
        el.appendChild(d)
      }
    })
    return () => {
      if (kolamLeftRef.current) kolamLeftRef.current.innerHTML = ''
      if (kolamRightRef.current) kolamRightRef.current.innerHTML = ''
    }
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') onEnter()
  }

  return (
    <section
      className="min-h-screen relative flex flex-col items-center justify-center text-center px-8 overflow-hidden cursor-pointer"
      style={{
        backgroundColor: 'var(--beige-light)',
        backgroundImage: `
          radial-gradient(ellipse at 10% 20%, rgba(168,50,40,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 90% 80%, rgba(78,122,48,0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 70%)
        `,
      }}
      onClick={onEnter}
      onKeyDown={handleKeyDown}
      role="button"
      aria-label="Click to view wedding details"
      tabIndex={0}
    >
      {/* Frame border */}
      <div className="frame-border" />

      {/* Mandala rings */}
      <div className="mandala-bg" />

      {/* Petals */}
      <div className="petals-container" ref={petalsRef} />

      {/* Corner ornaments */}
      <div className="corner-ornament corner-tl"><CornerOrnamentSVG /></div>
      <div className="corner-ornament corner-tr" />
      <div className="corner-ornament corner-bl" />
      <div className="corner-ornament corner-br" />

      {/* Leaf strips */}
      <div className="leaf-strip top">
        {[GiOakLeaf, GiLotusFlower, GiOakLeaf, GiLotusFlower, GiOakLeaf, GiLotusFlower, GiOakLeaf].map((Icon, i) => (
          <span key={i}><Icon /></span>
        ))}
      </div>
      <div className="leaf-strip bottom">
        {[GiOakLeaf, GiLotusFlower, GiOakLeaf, GiLotusFlower, GiOakLeaf, GiLotusFlower, GiOakLeaf].map((Icon, i) => (
          <span key={i}><Icon /></span>
        ))}
      </div>

      {/* Kolam side dots */}
      <div className="kolam-strip left" ref={kolamLeftRef} />
      <div className="kolam-strip right" ref={kolamRightRef} />

      {/* Main content */}
      <div
        className="relative z-10 flex flex-col items-center gap-2"
        style={{ animation: 'fadeInUp 1.2s ease both' }}
      >
        <p
          className="font-lato font-light tracking-[0.35em] text-xs uppercase"
          style={{ color: 'var(--text-light)', animation: 'fadeInUp 1.4s ease both' }}
        >
          Together with their families
        </p>

        <div className="garland-line">
          <GiFlowerEmblem style={{ color: 'var(--red-mid)', fontSize: '1.1rem' }} />
        </div>

        <p
          className="font-cormorant italic text-ink-mid"
          style={{ fontSize: 'clamp(1rem, 3vw, 1.4rem)', animation: 'fadeInUp 1.5s ease both' }}
        >
          cordially invite you to celebrate the wedding of
        </p>

        {/* Names */}
        <div className="relative px-10 py-6">
          <div
            className="bride-name gold-text px-2 pt-4"
            style={{ animation: 'goldShimmer 3s linear infinite, fadeInUp 1.6s ease both' }}
          >
            Vaishnavi
          </div>
          <span className="ampersand ampersand-text">
            &amp;
          </span>
          <div
            className="groom-name gold-text px-2 pt-2"
            style={{ animation: 'goldShimmer 3s linear infinite, fadeInUp 1.6s ease both', animationDelay: '0.15s' }}
          >
            Abishek
          </div>
        </div>

        <div className="garland-line">
          <PiStarFourFill style={{ color: 'var(--green-mid)', fontSize: '1.1rem' }} />
        </div>

        <p
          className="font-cormorant tracking-[0.2em] text-ink-mid mt-2"
          style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)', animation: 'fadeInUp 1.8s ease both' }}
        >
          April 27 &nbsp;·&nbsp; 2025
        </p>

        {/* CTA */}
        <div
          className="mt-8 flex flex-col items-center gap-2"
          style={{ animation: 'fadeInUp 2s ease both' }}
        >
          <p className="font-lato font-light tracking-[0.2em] text-[0.78rem] uppercase" style={{ color: 'var(--text-light)' }}>
            Tap to open your invitation
          </p>
          <div className="cta-arrow" />
        </div>
      </div>
    </section>
  )
}

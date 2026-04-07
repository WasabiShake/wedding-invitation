import { useEffect, useRef, useState } from 'react'
import { IoArrowBack } from 'react-icons/io5'
import TelanganaMap from './maps/TelanganaMap'
import TamilNaduMap from './maps/TamilNaduMap'


export default function LocationPage({ onSelectCity, onBack }) {
  const [clickedCity, setClickedCity] = useState(null);

  return (
    <section
      className="min-h-screen relative flex flex-col items-center justify-start pt-[25vh] text-center px-8 pb-12 overflow-hidden"
      style={{
        backgroundColor: 'transparent',
        backgroundImage: `
          radial-gradient(ellipse at 20% 20%, rgba(78,122,48,0.07) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 80%, rgba(168,50,40,0.07) 0%, transparent 50%)
        `,
      }}
    >

      {/* Back button */}
      <button
        id="back-to-landing"
        onClick={onBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 bg-transparent border border-gold-mid/40 font-lato text-[0.78rem] tracking-[0.15em] px-4 py-2 transition-all duration-300 hover:bg-gold-mid/10 hover:border-gold-mid"
        style={{ color: 'var(--gold-dark)' }}
      >
        <IoArrowBack className="text-base" /> Back
      </button>

      <div
        className="relative z-10 flex flex-col items-center w-full max-w-2xl"
        style={{ animation: 'fadeInUp 0.6s ease both' }}
      >
        <p
          className="font-lato font-light tracking-[0.35em] text-[0.72rem] uppercase mb-2"
          style={{ color: 'var(--text-light)' }}
        >
          Select your venue city
        </p>

        <h1
          className="font-cormorant font-light text-ink-dark mb-2"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', animation: 'fadeInUp 0.7s ease both' }}
        >
          Where will you <span className="gold-span px-1">join us?</span>
        </h1>

        <p
          className="font-cormorant italic text-ink-mid text-base mb-12"
          style={{ animation: 'fadeInUp 0.8s ease both' }}
        >
          We are celebrating in two beautiful cities
        </p>

        {/* City buttons */}
        <div
          className="flex gap-12 justify-center flex-wrap"
          style={{ animation: 'fadeInUp 0.9s ease both' }}
        >
          {/* Hyderabad */}
          <button
            id="btn-hyderabad"
            className="city-btn hyderabad"
            onClick={(e) => {
              setClickedCity('hyderabad');
              const rect = e.currentTarget.querySelector('.w-14').getBoundingClientRect();
              onSelectCity('hyderabad', {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              });
            }}
            aria-label="Select Hyderabad"
          >
            <div className="ripple-ring" />
            <div className={`flex items-center justify-center w-14 h-14 transition-opacity duration-150 ${clickedCity === 'hyderabad' ? 'opacity-0' : 'opacity-100'}`}>
              <TelanganaMap className="w-full h-full" style={{ color: 'var(--gold-dark)', strokeWidth: 25 }} />
            </div>
            <div className="font-playfair text-[1.15rem] text-ink-dark tracking-wide">Hyderabad</div>
            <div className="font-lato text-[0.65rem] tracking-[0.2em] uppercase" style={{ color: 'var(--text-light)' }}>Telangana</div>
          </button>

          {/* Chennai */}
          <button
            id="btn-chennai"
            className="city-btn chennai"
            onClick={(e) => {
              setClickedCity('chennai');
              const rect = e.currentTarget.querySelector('.w-14').getBoundingClientRect();
              onSelectCity('chennai', {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              });
            }}
            aria-label="Select Chennai"
          >
            <div className="ripple-ring" />
            <div className={`flex items-center justify-center w-14 h-14 transition-opacity duration-150 ${clickedCity === 'chennai' ? 'opacity-0' : 'opacity-100'}`}>
              <TamilNaduMap className="w-full h-full" style={{ color: 'var(--gold-dark)', strokeWidth: 2.5 }} />
            </div>
            <div className="font-playfair text-[1.15rem] text-ink-dark tracking-wide">Chennai</div>
            <div className="font-lato text-[0.65rem] tracking-[0.2em] uppercase" style={{ color: 'var(--text-light)' }}>Tamil Nadu</div>
          </button>
        </div>
      </div>
    </section>
  )
}

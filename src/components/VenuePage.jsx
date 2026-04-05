import { venues } from '../data/venues'
import EventCard from './EventCard'
import { IoArrowBack, IoChevronDown } from 'react-icons/io5'
import { MdLocationPin } from 'react-icons/md'
import { PiStarFourFill } from 'react-icons/pi'
import TelanganaMap from './maps/TelanganaMap'
import TamilNaduMap from './maps/TamilNaduMap'

export default function VenuePage({ city, onBack }) {
  const data = venues[city]
  if (!data) return null

  return (
    <section
      className="min-h-screen relative flex flex-col items-center overflow-hidden pt-20 pb-16 px-8"
      style={{
        backgroundColor: 'transparent',
        backgroundImage: `
          radial-gradient(ellipse at 0% 0%, rgba(78,122,48,0.07) 0%, transparent 40%),
          radial-gradient(ellipse at 100% 100%, rgba(168,50,40,0.07) 0%, transparent 40%)
        `,
      }}
    >

      {/* Map silhouette background */}
      <div className="venue-map-bg" aria-hidden="true">
        {city === 'hyderabad'
          ? <TelanganaMap className="w-full h-full" style={{ color: 'var(--gold-dark)', strokeWidth: 25 }} />
          : <TamilNaduMap className="w-full h-full" style={{ color: 'var(--gold-dark)', strokeWidth: 2.5 }} />
        }
      </div>

      {/* Back button */}
      <button
        id="back-to-location"
        onClick={onBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-1.5 bg-transparent border border-gold-mid/40 font-lato text-[0.78rem] tracking-[0.15em] px-4 py-2 transition-all duration-300 hover:bg-gold-mid/10 hover:border-gold-mid"
        style={{ color: 'var(--gold-dark)' }}
      >
        <IoArrowBack className="text-base" /> Cities
      </button>

      {/* Venue header */}
      <div
        className="text-center mb-10 relative z-[2]"
        style={{ animation: 'fadeInUp 0.6s ease both' }}
      >
        {/* City tag */}
        <div
          className="inline-flex items-center gap-1.5 font-lato text-[0.7rem] tracking-[0.3em] uppercase border px-3.5 py-1 mb-4 rounded-sm"
          style={{
            background: 'var(--beige-mid)',
            borderColor: 'var(--gold-mid)',
            color: 'var(--gold-dark)',
          }}
        >
          <MdLocationPin className="text-base" /> {data.cityLabel}
        </div>

        <p
          className="font-cormorant font-light tracking-[0.05em] mb-1"
          style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', color: 'var(--text-mid)' }}
        >
          Venue
        </p>

        <a
          id="venue-map-link"
          href={data.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="venue-name-link"
        >
          {data.name}
          <span
            className="inline-block text-base ml-1.5 align-middle"
            style={{ color: 'var(--red-mid)', animation: 'bounce 2s ease-in-out infinite' }}
          >
            <MdLocationPin />
          </span>
        </a>

        <p
          className="font-lato text-[0.82rem] tracking-[0.05em] mt-1"
          style={{ color: 'var(--text-light)' }}
        >
          {data.address}
        </p>
      </div>

      {/* Divider */}
      <div className="section-divider">
        <PiStarFourFill style={{ color: 'var(--gold-mid)', fontSize: '1rem' }} />
      </div>

      {/* Grouped Events */}
      <div className="w-full max-w-5xl flex flex-col gap-12" style={{ animation: 'fadeInUp 0.8s ease both' }}>
        {Object.entries(
          data.events.reduce((acc, event) => {
            if (!acc[event.badge]) acc[event.badge] = { date: event.date, events: [] };
            acc[event.badge].events.push(event);
            return acc;
          }, {})
        ).map(([badge, { date, events }]) => (
          <div key={badge} className="flex flex-col items-center">
            {/* Prominent Date / Day Header */}
            <div className="mb-8 text-center flex flex-col items-center">
              <h2 className="font-playfair text-3xl mb-1.5" style={{ color: 'var(--gold-dark)' }}>{badge}</h2>
              <div className="h-px w-16 mb-3" style={{ backgroundColor: 'rgba(196, 164, 119, 0.3)' }}></div>
              <p className="font-lato tracking-[0.15em] uppercase text-sm font-semibold" style={{ color: 'var(--red-mid)' }}>{date}</p>
            </div>
            
            <div
              className="grid gap-5 w-full"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              }}
            >
              {events.map((event, i) => (
                <EventCard key={event.name} event={event} index={i} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="scroll-hint flex items-center gap-1.5">Scroll to explore <IoChevronDown /></div>
    </section>
  )
}

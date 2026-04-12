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
          ? <TelanganaMap className="w-full h-full" style={{ color: 'var(--magenta-dark)', strokeWidth: 25 }} />
          : <TamilNaduMap className="w-full h-full" style={{ color: 'var(--magenta-dark)', strokeWidth: 2.5 }} />
        }
      </div>

      {/* Back button */}
      <button
        id="back-to-location"
        onClick={onBack}
        className="absolute top-6 left-6 glass-back-btn"
      >
        <IoArrowBack className="text-base" /> Cities
      </button>

      {/* Venue header */}
      <div
        className="text-center mb-4 relative z-[2]"
        style={{ animation: 'fadeInUp 0.6s ease both' }}
      >
        {/* City tag */}
        <div
          className="inline-flex items-center gap-1.5 font-lato text-[0.7rem] tracking-[0.3em] uppercase border px-3.5 py-1 mb-4 rounded-sm"
          style={{
            background: 'var(--magenta-lightest)',
            borderColor: 'var(--magenta-mid)',
            color: 'var(--magenta-dark)',
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
            style={{ color: 'var(--aqua-mid)', animation: 'bounce 2s ease-in-out infinite' }}
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
        <PiStarFourFill style={{ color: 'var(--magenta-mid)', fontSize: '1rem' }} />
      </div>

      {/* Grouped Events */}
      <div className="w-full max-w-5xl flex flex-col gap-12">
        {Object.entries(
          data.events.reduce((acc, event) => {
            const key = event.day || event.date;
            if (!acc[key]) acc[key] = { day: event.day, date: event.date, events: [] };
            acc[key].events.push(event);
            return acc;
          }, {})
        ).map(([key, { day, date, events }]) => (
          <div key={key} className="flex flex-col items-center">
            {/* Prominent Date / Day Header */}
            <div className="mb-8 text-center flex flex-col items-center gap-2">
              {day && (
                <h2
                  className="font-playfair text-3xl px-6 pb-2 pt-1 rounded-full"
                  style={{
                    color: 'var(--magenta-dark)',
                    background: '#fed5cc70',
                    WebkitBackdropFilter: 'blur(4px)',
                    backdropFilter: 'blur(4px)',
                    transform: 'translateZ(0)',
                    boxShadow: '0 4px 20px rgba(158, 16, 69, 0.06)',
                  }}
                >{day}</h2>
              )}
              <p
                className="font-lato tracking-[0.15em] uppercase text-sm font-semibold px-5 py-1.5 rounded-full"
                style={{
                  color: 'var(--aqua-mid)',
                  background: '#fed5cc70',
                  WebkitBackdropFilter: 'blur(4px)',
                  backdropFilter: 'blur(4px)',
                  transform: 'translateZ(0)',
                  boxShadow: '0 4px 20px rgba(158, 16, 69, 0.06)',
                }}
              >{date}</p>
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

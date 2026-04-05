import { BsCalendar3, BsClock } from 'react-icons/bs'
import { GiFlowerTwirl, GiFlowers, GiMusicalNotes, GiCandleFlame, GiSparkles, GiBigDiamondRing, GiDoubleNecklace } from 'react-icons/gi'
import { MdRestaurant } from 'react-icons/md'

const EVENT_ICONS = {
  mehendi: <GiFlowerTwirl />,
  haldi: <GiFlowers />,
  sangeet: <GiMusicalNotes />,
  wedding: <GiDoubleNecklace />,
  reception: <GiSparkles />,
  meal: <MdRestaurant />,
  nischayathartham: <GiBigDiamondRing />,
}

export default function EventCard({ event, index }) {
  const { name, icon, badge, accent, desc, date, time } = event

  return (
    <div
      className={`event-card accent-${accent} bg-beige-lightest border border-gold-mid/25 rounded-sm overflow-hidden relative transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl`}
      style={{ animationDelay: `${0.1 + index * 0.08}s` }}
    >
      {/* Accent colour strip */}
      <div className="event-card-accent h-[5px] w-full" />

      {/* Card body */}
      <div className="px-5 pt-5 pb-4">
        {/* Badge */}
        <div className="event-badge inline-flex items-center gap-1.5 font-lato text-[0.62rem] tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm mb-3">
          <span className="text-[0.9rem] leading-none">{EVENT_ICONS[icon]}</span>
          {badge}
        </div>

        {/* Name */}
        <div className="font-playfair text-xl text-ink-dark mb-1.5 font-normal">
          {name}
        </div>

        {/* Description */}
        <div className="font-lato text-[0.8rem] text-ink-light leading-relaxed mb-4">
          {desc}
        </div>

        {/* Meta rows */}
        <div className="flex flex-col gap-1.5 border-t border-gold-mid/20 pt-4">
          <div className="flex items-center gap-2 font-lato text-[0.78rem] text-ink-mid">
            <BsCalendar3 className="w-4 h-4 shrink-0 opacity-60" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 font-lato text-[0.78rem] text-ink-mid">
            <BsClock className="w-4 h-4 shrink-0 opacity-60" />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

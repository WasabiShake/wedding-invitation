import { useState, useEffect } from 'react';
import { venues } from '../data/venues';

const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

export default function CalendarAnimation({ city }) {
  const [sequence, setSequence] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [eventDates, setEventDates] = useState([]);

  useEffect(() => {
    if (!city || !venues[city]) return;

    // 1. Parse target dates for the city
    const data = venues[city];
    const dates = [];
    let targetMonth = -1;
    let targetYear = -1;

    data.events.forEach(evt => {
      // "Tuesday, 16th June 2026" -> "16 June 2026"
      const parts = evt.date.split(', ');
      if (parts.length > 1) {
        const cleanDateStr = parts[1].replace(/(st|nd|rd|th)/, '');
        const d = new Date(cleanDateStr);
        if (!isNaN(d.valueOf())) {
          dates.push(d.getDate());
          targetMonth = d.getMonth();
          targetYear = d.getFullYear();
        }
      }
    });

    setEventDates(dates);

    // 2. Compute sequence from current date to target date
    const now = new Date();
    // System time is April 2026
    const startMonth = now.getMonth();
    const startYear = now.getFullYear();

    // If target could not be parsed, default to same
    if (targetMonth === -1) {
      targetMonth = startMonth;
      targetYear = startYear;
    }

    const seq = [];
    let curM = startMonth;
    let curY = startYear;

    // Safety fallback to prevent infinite loop
    let maxSteps = 24; 

    while ((curM !== targetMonth || curY !== targetYear) && maxSteps > 0) {
      seq.push({ m: curM, y: curY });
      
      // Calculate direction
      const currentVal = curY * 12 + curM;
      const targetVal = targetYear * 12 + targetMonth;

      if (currentVal < targetVal) {
        curM++;
        if (curM > 11) {
          curM = 0;
          curY++;
        }
      } else {
        curM--;
        if (curM < 0) {
          curM = 11;
          curY--;
        }
      }
      maxSteps--;
    }
    seq.push({ m: targetMonth, y: targetYear });

    setSequence(seq);
    setActiveIndex(0);

    // 3. Play animation
    // The map zoom takes ~1.2s. Wait a bit before flipping aggressively.
    if (seq.length > 1) {
      const stepDuration = Math.min(600, 2000 / (seq.length - 1));
      let interval;
      
      const timeout = setTimeout(() => {
        interval = setInterval(() => {
          setActiveIndex(prev => {
            if (prev < seq.length - 1) return prev + 1;
            clearInterval(interval);
            return prev;
          });
        }, stepDuration);
      }, 1000);
      
      return () => {
        clearTimeout(timeout);
        if (interval) clearInterval(interval);
      };
    }
  }, [city]);

  if (sequence.length === 0) return null;

  const current = sequence[activeIndex];
  const isTargetMonth = activeIndex === sequence.length - 1;

  // Calendar Grid calculations
  const daysInMonth = new Date(current.y, current.m + 1, 0).getDate();
  const firstDay = new Date(current.y, current.m, 1).getDay();

  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className={`calendar-animation-wrapper ${isTargetMonth ? 'target-reached' : ''}`}>
      <div className="calendar-widget" key={`${current.m}-${current.y}`}>
        <div className="calendar-header">
          {MONTH_NAMES[current.m]} {current.y}
        </div>
        <div className="calendar-body">
          <div className="calendar-weekdays">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          <div className="calendar-grid">
            {blanks.map(b => <div key={`blank-${b}`} className="calendar-cell empty"></div>)}
            {days.map(d => {
              const highlight = isTargetMonth && eventDates.includes(d);
              return (
                <div key={d} className={`calendar-cell ${highlight ? 'highlight pulse-date' : ''}`}>
                  <span className="date-number">{d}</span>
                  {highlight && <div className="highlight-ring" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

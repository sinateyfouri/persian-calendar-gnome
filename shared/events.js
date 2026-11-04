import {SOLAR_EVENTS} from '../data/events.js';

export {SOLAR_EVENTS};

export function eventsForDate(jy, jm, jd, includeEvents = true) {
  if (!includeEvents)
    return [];
  return SOLAR_EVENTS.filter(event => event.month === jm && event.day === jd);
}

export function isHoliday(jy, jm, jd, weekday = null) {
  return weekday === 5 || eventsForDate(jy, jm, jd).some(event => event.holiday);
}

export function searchEvents(query) {
  const normalized = query.trim();
  if (!normalized)
    return [];
  return SOLAR_EVENTS.map(event => ({...event, calendar: 'شمسی'}))
    .filter(event => event.title.includes(normalized));
}

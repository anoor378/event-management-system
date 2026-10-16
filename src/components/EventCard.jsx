import { Link } from 'react-router-dom';
import { getBestImage, formatEventDate, getVenue, getCategory } from '../utils/eventHelpers';

const getDateParts = (event) => {
  const d = event?.dates?.start?.localDate;
  if (!d) return null;
  const date = new Date(`${d}T00:00:00`);
  return {
    month: date.toLocaleDateString(undefined, { month: 'short' }).toUpperCase(),
    day: date.getDate(),
  };
};

export default function EventCard({ event }) {
  const venue = getVenue(event);
  const { segment, genre } = getCategory(event);
  const image = getBestImage(event.images);
  const parts = getDateParts(event);

  return (
    <div className="event-card">
      <div className="card-media">
        {image && <img src={image} alt={event.name} loading="lazy" />}
        {parts && (
          <div className="date-badge">
            <span>{parts.month}</span>
            <strong>{parts.day}</strong>
          </div>
        )}
        {segment && segment !== 'Undefined' && (
          <span className="card-tag">
            {segment}
            {genre && genre !== 'Undefined' ? ` / ${genre}` : ''}
          </span>
        )}
      </div>
      <div className="event-card-body">
        <h3>{event.name}</h3>
        <p>🕒 {formatEventDate(event)}</p>
        <p>
          📍 {venue?.name || 'Venue TBA'}
          {venue?.city?.name ? `, ${venue.city.name}` : ''}
        </p>
        <Link to={`/events/${event.id}`} className="btn-link">View details</Link>
      </div>
    </div>
  );
}
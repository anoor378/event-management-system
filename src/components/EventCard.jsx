import { Link } from 'react-router-dom';
import { getBestImage, formatEventDate, getVenue, getCategory } from '../utils/eventHelpers';

export default function EventCard({ event }) {
  const venue = getVenue(event);
  const { segment, genre } = getCategory(event);
  const image = getBestImage(event.images);

  return (
    <div className="event-card">
      {image && <img src={image} alt={event.name} loading="lazy" />}
      <div className="event-card-body">
        {segment && (
          <span className="badge">
            {segment}
            {genre && genre !== 'Undefined' ? ` / ${genre}` : ''}
          </span>
        )}
        <h3>{event.name}</h3>
        <p>{formatEventDate(event)}</p>
        <p>
          {venue?.name}
          {venue?.city?.name ? `, ${venue.city.name}` : ''}
        </p>
        <Link to={`/events/${event.id}`}>View details</Link>
      </div>
    </div>
  );
}
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../features/events/eventsSlice';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function Events() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.events);

  const load = () => {
    dispatch(fetchEvents({ startDateTime: new Date().toISOString().split('.')[0] + 'Z' }));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <Loader text="Loading events..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (items.length === 0) return <p>No events found.</p>;

  return (
    <div>
      <h2>Upcoming Events</h2>
      <div className="events-grid">
        {items.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
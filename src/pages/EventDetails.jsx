import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchEventById } from '../features/events/eventsSlice';
import {
  registerForEvent,
  cancelRegistration,
  selectIsRegistered,
} from '../features/registrations/registrationsSlice';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import Toast from '../components/Toast';
import {
  getBestImage,
  formatEventDate,
  getVenue,
  getCategory,
  getPriceRange,
  isUpcoming,
} from '../utils/eventHelpers';

export default function EventDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState(null);

  const { selected: event, selectedLoading, selectedError } = useSelector(
    (state) => state.events
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const registered = useSelector(selectIsRegistered(user?.id, id));

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  if (selectedLoading) return <Loader text="Loading event..." />;
  if (selectedError)
    return <ErrorMessage message={selectedError} onRetry={() => dispatch(fetchEventById(id))} />;
  if (!event) return null;

  const venue = getVenue(event);
  const { segment, genre } = getCategory(event);
  const image = getBestImage(event.images);
  const upcoming = isUpcoming(event);

  const handleRegister = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (registered) {
      setToast({ type: 'error', message: 'You are already registered for this event' });
      return;
    }
    dispatch(
      registerForEvent({
        userId: user.id,
        eventId: event.id,
        snapshot: {
          name: event.name,
          image,
          date: event.dates?.start?.localDate || null,
          dateLabel: formatEventDate(event),
          venue: venue?.name || '',
          city: venue?.city?.name || '',
        },
      })
    );
    setToast({ type: 'success', message: 'Registered successfully!' });
  };

  const handleCancel = () => {
    dispatch(cancelRegistration({ userId: user.id, eventId: event.id }));
    setToast({ type: 'success', message: 'Registration cancelled' });
  };

  return (
    <div className="details">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <Link to="/events">&larr; Back to events</Link>
      {image && <img className="details-image" src={image} alt={event.name} />}
      <h2>{event.name}</h2>

      <div className="details-info">
        <p><strong>Date and time:</strong> {formatEventDate(event)}</p>
        <p><strong>Venue:</strong> {venue?.name || 'To be announced'}</p>
        <p>
          <strong>Location:</strong>{' '}
          {[venue?.address?.line1, venue?.city?.name, venue?.state?.name, venue?.country?.name]
            .filter(Boolean)
            .join(', ') || 'To be announced'}
        </p>
        <p>
          <strong>Category:</strong> {segment || 'N/A'}
          {genre && genre !== 'Undefined' ? ` / ${genre}` : ''}
        </p>
        <p><strong>Price:</strong> {getPriceRange(event)}</p>
        {event.info && <p><strong>Info:</strong> {event.info}</p>}
        {event.pleaseNote && <p><strong>Please note:</strong> {event.pleaseNote}</p>}
        {event.url && (
          <p>
            <a href={event.url} target="_blank" rel="noreferrer">
              Buy tickets on Ticketmaster
            </a>
          </p>
        )}
      </div>

      <div className="register-box">
        {!upcoming ? (
          <p>This event has already taken place.</p>
        ) : registered ? (
          <>
            <span className="badge">You are registered</span>
            <button className="btn-danger" onClick={handleCancel}>
              Cancel registration
            </button>
          </>
        ) : (
          <button className="btn-primary" onClick={handleRegister}>
            {isAuthenticated ? 'Register for this event' : 'Login to register'}
          </button>
        )}
      </div>
    </div>
  );
}
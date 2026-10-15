import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { cancelRegistration } from '../features/registrations/registrationsSlice';
import Toast from '../components/Toast';

const isUpcomingDate = (dateStr) => {
  if (!dateStr) return true;
  return new Date(`${dateStr}T23:59:59`) >= new Date();
};

export default function MyEvents() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const allRegistrations = useSelector((state) => state.registrations.items);
  const [tab, setTab] = useState('upcoming');
  const [toast, setToast] = useState(null);

  const { upcoming, completed } = useMemo(() => {
    const mine = allRegistrations.filter((r) => r.userId === user?.id);
    return {
      upcoming: mine.filter((r) => isUpcomingDate(r.eventSnapshot?.date)),
      completed: mine.filter((r) => !isUpcomingDate(r.eventSnapshot?.date)),
    };
  }, [allRegistrations, user]);

  const handleCancel = (eventId) => {
    if (!window.confirm('Cancel your registration for this event?')) return;
    dispatch(cancelRegistration({ userId: user.id, eventId }));
    setToast({ type: 'success', message: 'Registration cancelled' });
  };

  const list = tab === 'upcoming' ? upcoming : completed;

  return (
    <div className="my-events">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <h2>My Events</h2>

      <div className="tabs">
        <button
          className={tab === 'upcoming' ? 'tab active' : 'tab'}
          onClick={() => setTab('upcoming')}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          className={tab === 'completed' ? 'tab active' : 'tab'}
          onClick={() => setTab('completed')}
        >
          Completed ({completed.length})
        </button>
      </div>

      {list.length === 0 ? (
        <p>
          {tab === 'upcoming'
            ? 'You have no upcoming registrations.'
            : 'You have no completed events yet.'}{' '}
          {tab === 'upcoming' && <Link to="/events">Browse events</Link>}
        </p>
      ) : (
        <div className="events-grid">
          {list.map((r) => {
            const s = r.eventSnapshot || {};
            return (
              <div className="event-card" key={r.eventId}>
                {s.image && <img src={s.image} alt={s.name} loading="lazy" />}
                <div className="event-card-body">
                  <span className="badge">{tab === 'upcoming' ? 'Upcoming' : 'Completed'}</span>
                  <h3>{s.name}</h3>
                  <p>{s.dateLabel}</p>
                  <p>
                    {s.venue}
                    {s.city ? `, ${s.city}` : ''}
                  </p>
                  <p className="small">
                    Registered on {new Date(r.registeredAt).toLocaleDateString()}
                  </p>
                  <Link to={`/events/${r.eventId}`}>View details</Link>
                  {tab === 'upcoming' && (
                    <div>
                      <button className="btn-danger" onClick={() => handleCancel(r.eventId)}>
                        Cancel registration
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
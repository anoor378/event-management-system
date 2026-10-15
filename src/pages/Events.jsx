import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, fetchCategories } from '../features/events/eventsSlice';
import useDebounce from '../hooks/useDebounce';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';
import { isUpcoming } from '../utils/eventHelpers';

const emptyFilters = { category: '', city: '', date: '' };

const pad = (n) => String(n).padStart(2, '0');
const todayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export default function Events() {
  const dispatch = useDispatch();
  const { items, loading, error, page, totalPages, categories } = useSelector(
    (state) => state.events
  );

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(emptyFilters);
  const [currentPage, setCurrentPage] = useState(0);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedCity = useDebounce(filters.city, 500);

  useEffect(() => {
    if (categories.length === 0) dispatch(fetchCategories());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const params = {
      keyword: debouncedSearch,
      classificationName: filters.category,
      city: debouncedCity,
      page: currentPage,
    };

    if (filters.date) {
      params.localStartDateTime = `${filters.date}T00:00:00,${filters.date}T23:59:59`;
    } else {
      params.localStartDateTime = `${todayString()}T00:00:00,*`;
    }

    dispatch(fetchEvents(params));
  }, [dispatch, debouncedSearch, debouncedCity, filters.category, filters.date, currentPage]);

  const handleSearch = (value) => {
    setSearch(value);
    setCurrentPage(0);
  };

  const handleFilterChange = (change) => {
    setFilters({ ...filters, ...change });
    setCurrentPage(0);
  };

  const handleReset = () => {
    setSearch('');
    setFilters(emptyFilters);
    setCurrentPage(0);
  };

  const handlePageChange = (p) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const upcomingItems = items.filter(isUpcoming);

  return (
    <div>
      <h2>Upcoming Events</h2>
      <SearchBar value={search} onChange={handleSearch} />
      <Filters
        categories={categories}
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {loading && <Loader text="Loading events..." />}
      {!loading && error && (
        <ErrorMessage message={error} onRetry={() => setCurrentPage(0)} />
      )}
      {!loading && !error && upcomingItems.length === 0 && (
        <p>No events found. Try different filters.</p>
      )}
      {!loading && !error && upcomingItems.length > 0 && (
        <>
          <div className="events-grid">
            {upcomingItems.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
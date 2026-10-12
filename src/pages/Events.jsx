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

const emptyFilters = { category: '', city: '', date: '' };

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

  const buildParams = () => {
    const start = filters.date
      ? `${filters.date}T00:00:00Z`
      : new Date().toISOString().split('.')[0] + 'Z';
    const params = {
      keyword: debouncedSearch,
      classificationName: filters.category,
      city: debouncedCity,
      startDateTime: start,
      page: currentPage,
    };
    if (filters.date) params.endDateTime = `${filters.date}T23:59:59Z`;
    return params;
  };

  const load = () => dispatch(fetchEvents(buildParams()));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, debouncedCity, filters.category, filters.date, currentPage]);

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
      {!loading && error && <ErrorMessage message={error} onRetry={load} />}
      {!loading && !error && items.length === 0 && <p>No events found. Try different filters.</p>}
      {!loading && !error && items.length > 0 && (
        <>
          <div className="events-grid">
            {items.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
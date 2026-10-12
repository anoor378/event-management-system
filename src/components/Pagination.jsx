export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Ticketmaster allows deep paging only up to size * page < 1000
  const maxPage = Math.min(totalPages, Math.floor(1000 / 12)) - 1;

  return (
    <div className="pagination">
      <button disabled={page === 0} onClick={() => onPageChange(page - 1)}>
        Previous
      </button>
      <span>
        Page {page + 1} of {maxPage + 1}
      </span>
      <button disabled={page >= maxPage} onClick={() => onPageChange(page + 1)}>
        Next
      </button>
    </div>
  );
}
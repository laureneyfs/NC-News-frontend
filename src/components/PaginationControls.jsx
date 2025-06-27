import { buildSearchParams } from "../utils/buildSearchParams";

function Pagination({
  page,
  setSearchParams,
  sortBy,
  order,
  paramTopic,
  articles,
}) {
  function handlePageChange(newPage) {
    setSearchParams(() => {
      return buildSearchParams({
        topic: paramTopic,
        sortBy,
        order,
        p: newPage,
      });
    });
  }

  return (
    <section className="page-nav">
      <button
        className="page-button"
        id="prev-page"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        Previous Page
      </button>
      <p id="page-number">Page: {page}</p>
      <button
        className="page-button"
        id="next-page"
        disabled={articles.length !== 10}
        onClick={() => handlePageChange(page + 1)}
      >
        Next Page
      </button>
    </section>
  );
}

export default Pagination;

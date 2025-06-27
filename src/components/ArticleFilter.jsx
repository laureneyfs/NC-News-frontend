function ArticleFilter({
  sortBy,
  order,
  onSortChange,
  onOrderChange,
  onSubmit,
}) {
  return (
    <form className="sort-block" onSubmit={onSubmit}>
      <h3>Sort results by...</h3>
      <select id="sort-by" value={sortBy} onChange={onSortChange}>
        <option value="created_at">date</option>
        <option value="comment_count">comment count</option>
        <option value="votes">votes</option>
      </select>
      <select id="sort-order" value={order} onChange={onOrderChange}>
        <option value="desc">descending</option>
        <option value="asc">ascending</option>
      </select>
      <button>Sort</button>
    </form>
  );
}

export default ArticleFilter;

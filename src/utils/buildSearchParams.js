export function buildSearchParams({ topic, sortBy, order, p }) {
  const params = new URLSearchParams();
  if (topic) {
    params.set("topic", topic);
  }
  if (sortBy && sortBy !== "created_at") {
    params.set("sort_by", sortBy);
  }
  if (order && order !== "desc") {
    params.set("order", order);
  }
  if (p && p !== "1") {
    params.set("p", p);
  }
  return params;
}

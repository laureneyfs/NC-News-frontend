export const baseUrl = `https://nc-news-3uk2.onrender.com/api`;

export function fetchArticles(queryParams) {
  const filteredParams = Object.entries(queryParams).filter(
    ([key, value]) => value !== null && value !== ""
  );

  const query = new URLSearchParams(filteredParams).toString();
  return fetch(`${baseUrl}/articles?${query}`).then((res) => {
    if (!res.ok) {
      throw new Error("Topic does not exist!");
    }
    return res.json();
  });
}

export function patchArticle(article_id, voteChange) {
  return fetch(`${baseUrl}/articles/${article_id}`, {
    method: "PATCH",
    body: JSON.stringify({ inc_votes: voteChange }),
    headers: { "Content-type": "application/json" },
  }).then((res) => {
    if (!res.ok) throw new Error("vote failed!");
    return res.json();
  });
}

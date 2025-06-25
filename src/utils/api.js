const baseURL = "https://nc-news-3uk2.onrender.com/api";

async function fetchArticles(
  { topic, sortBy, order },
  setArticles,
  setError,
  setLoading
) {
  try {
    const query = new URLSearchParams();
    if (topic) query.append("topic", topic);
    if (sortBy) query.append("sort_by", sortBy);
    if (order) query.append("order", order);

    const res = await fetch(`${baseURL}/articles?${query.toString()}`);
    if (!res.ok) throw new Error("Topic does not exist!");
    const data = await res.json();
    setArticles(data.articles.map((article) => ({ ...article, userVote: 0 })));
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

function patchArticle(article_id, voteChange, setLoadingArticles, setArticles) {
  setLoadingArticles((ids) => [...ids, article_id]);

  return fetch(`${baseURL}/articles/${article_id}`, {
    method: "PATCH",
    body: JSON.stringify({ inc_votes: voteChange }),
    headers: { "Content-type": "application/json" },
  })
    .then((res) => {
      if (!res.ok) throw new Error("vote failed!");
      return res.json();
    })
    .catch(() => {
      setArticles((currArticles) =>
        currArticles.map((article) =>
          article.article_id === article_id
            ? { ...article, votes: article.votes - voteChange, userVote: 0 }
            : article
        )
      );
    })
    .finally(() => {
      setLoadingArticles((ids) => ids.filter((id) => id !== article_id));
    });
}

export { fetchArticles, patchArticle };

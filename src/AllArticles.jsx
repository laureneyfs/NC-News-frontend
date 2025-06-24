import { useEffect, useState } from "react";
import { Link } from "react-router";

function AllArticles() {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://nc-news-3uk2.onrender.com/api/articles`
        );
        if (!res.ok) throw new Error("Something went wrong!");
        const data = await res.json();
        setArticles(
          data.articles.map((article) => ({ ...article, userVote: 0 }))
        );
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  function patchArticle(article_id, voteChange) {
    console.log("PATCH called", article_id, voteChange);

    setLoadingArticles((ids) => [...ids, article_id]);
    return fetch(
      `https://nc-news-3uk2.onrender.com/api/articles/${article_id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ inc_votes: voteChange }),
        headers: { "Content-type": "application/json" },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("vote failed!");
        return res.json();
      })
      .catch(() => {
        setArticles((currArticles) =>
          currArticles.map((article) =>
            article.article_id === article_id
              ? {
                  ...article,
                  votes: article.votes - voteChange,
                  userVote: 0,
                }
              : article
          )
        );
      })
      .finally(() => {
        setLoadingArticles((ids) => ids.filter((id) => id !== article_id));
      });
  }

  function handleVote(article_id, vote) {
    console.log("handleVote called", article_id, vote);
    setArticles((currArticles) =>
      currArticles.map((article) => {
        if (article.article_id !== article_id) return article;
        let newUserVote = article.userVote || 0;
        let voteChange = 0;
        if (vote === newUserVote) {
          voteChange -= vote;
          newUserVote = 0;
        } else if (newUserVote === 0) {
          voteChange = vote;
          newUserVote = vote > 0 ? 1 : -1;
        } else {
          voteChange = vote * 2;
          newUserVote = vote > 0 ? 1 : -1;
        }
        patchArticle(article_id, voteChange);
        return {
          ...article,
          votes: article.votes + voteChange,
          userVote: newUserVote,
        };
      })
    );
  }

  if (error) {
    return (
      <section className="article">
        <p>Error: {error}</p>
      </section>
    );
  }
  if (isLoading) {
    return (
      <section className="article">
        <p>Loading articles...</p>
      </section>
    );
  }
  if (articles.length === 0) {
    return (
      <section className="article">
        <p>No articles found.</p>
      </section>
    );
  }

  return (
    <>
      {articles.map((article) => (
        <section className="article" key={article.article_id}>
          <section className="vote-block">
            <button
              onClick={() => handleVote(article.article_id, 1)}
              disabled={loadingArticles.includes(article.article_id)}
              className={article.userVote === 1 ? "upvoted" : ""}
            >
              ↑
            </button>
            <p>{article.votes}</p>
            <button
              onClick={() => handleVote(article.article_id, -1)}
              disabled={loadingArticles.includes(article.article_id)}
              className={article.userVote === -1 ? "downvoted" : ""}
            >
              ↓
            </button>
          </section>
          <img
            className="all-articles-image"
            src={article.article_img_url}
          ></img>
          <section className="article-fields">
            <h3>
              <Link to={`/articles/${article.article_id}`}>
                {article.title}
              </Link>{" "}
              by <Link to={`/users/${article.author}`}>{article.author}</Link>
            </h3>
            <p>
              topic: {article.topic} | posted:{" "}
              {new Date(article.created_at).toLocaleString()}
            </p>
            <p>{article.comment_count} comments</p>
          </section>
        </section>
      ))}
    </>
  );
}

export default AllArticles;

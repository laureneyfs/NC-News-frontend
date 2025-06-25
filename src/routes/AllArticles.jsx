import { useEffect, useState, useContext } from "react";
import { Link } from "react-router";
import { useParams, useSearchParams } from "react-router-dom";
import ArticleFilter from "../components/ArticleFilter";
import { UserContext } from "../contexts/UserContext";

function AllArticles() {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("");
  const [page, setPage] = useState(1);
  const { loggedInUser } = useContext(UserContext);
  const topicFromQuery = searchParams.get("topic");
  const paramsFromPath = useParams();
  const topicFromPath = paramsFromPath.topic;
  const sortFromPath = paramsFromPath.sort_by;
  const orderFromPath = paramsFromPath.order;
  const pFromPath = paramsFromPath.p;
  const pFromQuery = searchParams.get("p");
  const sortFromQuery = searchParams.get("sort_by");
  const orderFromQuery = searchParams.get("order");

  const paramTopic = topicFromPath || topicFromQuery;
  const paramOrder = orderFromPath || orderFromQuery;
  const paramSortBy = sortFromPath || sortFromQuery;
  const paramP = pFromPath || pFromQuery;

  useEffect(() => {
    const pageNumber = Number(paramP);
    setSortBy(paramSortBy || "created_at");
    setOrder(paramOrder || "desc");
    setPage(pageNumber > 0 ? pageNumber : 1);
  }, [paramSortBy, paramOrder, paramP]);

  useEffect(() => {
    const baseURL = "https://nc-news-3uk2.onrender.com/api/articles";
    const query = new URLSearchParams();
    if (paramTopic) query.append("topic", paramTopic);
    if (paramOrder) query.append("order", paramOrder);
    if (paramSortBy) query.append("sort_by", paramSortBy);
    if (paramP) query.append("p", paramP);

    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${baseURL}?${query.toString()}`);
        if (!res.ok) throw new Error("Topic does not exist!");
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
  }, [paramTopic, paramSortBy, paramOrder, paramP]);

  function patchArticle(article_id, voteChange) {
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
              ? { ...article, votes: article.votes - voteChange, userVote: 0 }
              : article
          )
        );
      })
      .finally(() => {
        setLoadingArticles((ids) => ids.filter((id) => id !== article_id));
      });
  }

  function handleVote(article_id, vote) {
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

  function handleSort(e) {
    setSortBy(e.target.value);
  }

  function handleOrder(e) {
    setOrder(e.target.value);
  }

  function handleFilterForm(e) {
    e.preventDefault();
    const params = {};
    if (paramTopic) params.topic = paramTopic;
    if (sortBy) params.sort_by = sortBy;
    if (order) params.order = order;
    setSearchParams(params);
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
      <>
        <ArticleFilter
          sortBy={sortBy}
          order={order}
          onSortChange={handleSort}
          onOrderChange={handleOrder}
          onSubmit={handleFilterForm}
        />
        <section className="article">
          <p>Loading articles...</p>
        </section>
      </>
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
      {paramTopic && (
        <h2 id="topic-text">
          Displaying articles about <span id="topic-name">{paramTopic}</span>
        </h2>
      )}
      <ArticleFilter
        sortBy={sortBy}
        order={order}
        onSortChange={handleSort}
        onOrderChange={handleOrder}
        onSubmit={handleFilterForm}
      />
      {articles.map((article) => (
        <>
          <section className="article" key={article.article_id}>
            <section className="vote-block">
              <button
                onClick={() => handleVote(article.article_id, 1)}
                disabled={
                  loggedInUser?.username === article.author ||
                  loadingArticles.includes(article.article_id)
                }
                className={article.userVote === 1 ? "upvoted" : ""}
              >
                ↑
              </button>
              <p
                className={
                  article.votes < 0
                    ? "vote-count negative-vote-count"
                    : "vote-count"
                }
              >
                {article.votes < 1000
                  ? article.votes
                  : `${article.votes / 1000}k`}
              </p>
              <button
                onClick={() => handleVote(article.article_id, -1)}
                disabled={
                  loggedInUser?.username === article.author ||
                  loadingArticles.includes(article.article_id)
                }
                className={article.userVote === -1 ? "downvoted" : ""}
              >
                ↓
              </button>
            </section>
            <img
              className="all-articles-image"
              src={article.article_img_url}
              alt={article.title}
            />
            <section className="article-fields">
              <h3>
                <Link to={`/articles/${article.article_id}`}>
                  {article.title}
                </Link>{" "}
                by <Link to={`/users/${article.author}`}>{article.author}</Link>
              </h3>
              <p>
                <span className="article-key">topic:</span>{" "}
                <Link to={`/topics/${article.topic}`}>{article.topic}</Link> |{" "}
                <span className="article-key">posted:</span>{" "}
                {new Date(article.created_at).toLocaleString()}
              </p>
              <p>{article.comment_count} comments</p>
            </section>
          </section>
        </>
      ))}
      <section className="page-nav">
        <button
          id="prev-page"
          disabled={page === 1}
          onClick={() => {
            const newPage = page - 1;
            setSearchParams((prev) => {
              const params = new URLSearchParams(prev);
              params.set("p", newPage);
              if (sortBy) params.set("sort_by", sortBy);
              if (order) params.set("order", order);
              if (paramTopic) params.set("topic", paramTopic);
              return params;
            });
          }}
        >
          Previous Page
        </button>
        <p id="page-number">Page: {page}</p>
        <button
          id="next-page"
          disabled={articles.length !== 10}
          onClick={() => {
            const newPage = page + 1;
            setSearchParams((prev) => {
              const params = new URLSearchParams(prev);
              params.set("p", newPage);
              if (sortBy) params.set("sort_by", sortBy);
              if (order) params.set("order", order);
              if (paramTopic) params.set("topic", paramTopic);
              return params;
            });
          }}
        >
          Next Page
        </button>
      </section>
    </>
  );
}

export default AllArticles;

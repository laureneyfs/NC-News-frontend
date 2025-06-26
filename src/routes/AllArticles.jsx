import { useEffect, useState, useContext } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import ArticleFilter from "../components/ArticleFilter";
import { UserContext } from "../contexts/UserContext";
import { patchArticle, fetchArticles, deleteArticle } from "../api/api";
import { computeVoteUpdate } from "../utils/voting";
import ArticleCard from "../components/ArticleCard";
import Pagination from "../components/PaginationControls";
import { buildSearchParams } from "../utils/buildSearchParams";

function AllArticles() {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [fetchedArticles, setFetchedArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("");
  const [page, setPage] = useState(1);
  const [deletingArticles, setDeletingArticles] = useState([]);
  const [deleteErrors, setDeleteErrors] = useState({});
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
    setLoading(true);
    const queryParams = {
      topic: paramTopic,
      order: paramOrder,
      sort_by: paramSortBy,
      p: paramP,
    };

    fetchArticles(queryParams)
      .then((data) => {
        setFetchedArticles(
          data.articles.map((article) => ({ ...article, userVote: 0 }))
        );
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [paramTopic, paramSortBy, paramOrder, paramP]);

  useEffect(() => {
    if (!isLoading && !error) {
      setArticles(fetchedArticles);
    }
  }, [isLoading, error, fetchedArticles]);

  function handleVote(article_id, vote) {
    setLoadingArticles((ids) => [...ids, article_id]);
    setArticles((currArticles) =>
      currArticles.map((article) => {
        if (article.article_id !== article_id) return article;

        const { voteChange, newUserVote } = computeVoteUpdate(
          article.userVote,
          vote
        );

        return {
          ...article,
          votes: article.votes + voteChange,
          userVote: newUserVote,
        };
      })
    );

    patchArticle(article_id, vote)
      .catch(() => {
        setArticles((currArticles) =>
          currArticles.map((article) =>
            article.article_id === article_id
              ? {
                  ...article,
                  votes: article.votes - vote,
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
  function handleSort(e) {
    setSortBy(e.target.value);
  }

  function handleOrder(e) {
    setOrder(e.target.value);
  }

  function handleFilterForm(e) {
    e.preventDefault();
    const params = buildSearchParams({
      topic: paramTopic,
      sortBy,
      order,
    });
    setSearchParams(params);
  }

  if (error) {
    return (
      <section className="article">
        <p>Error: {error}</p>
      </section>
    );
  }

  if (isLoading && articles.length === 0) {
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

  function handleDelete(article_id) {
    setDeletingArticles((prev) => [...prev, article_id]);
    setDeleteErrors((prev) => {
      const copy = { ...prev };
      delete copy[article_id];
      return copy;
    });
    deleteArticle(article_id)
      .then(() => {
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article.article_id !== article_id)
        );
      })
      .catch(() => {
        setDeleteErrors((prev) => ({
          ...prev,
          [article_id]: "Failed to delete article.",
        }));
      })
      .finally(() => {
        setDeletingArticles((prev) => prev.filter((id) => id !== article_id));
      });
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
        <ArticleCard
          key={article.article_id}
          article={article}
          isDeleting={deletingArticles.includes(article.article_id)}
          isVoting={loadingArticles.includes(article.article_id)}
          onVote={handleVote}
          onDelete={handleDelete}
          currentUser={loggedInUser}
          deleteError={deleteErrors[article.article_id]}
        />
      ))}
      <Pagination
        page={page}
        setSearchParams={setSearchParams}
        sortBy={sortBy}
        order={order}
        paramTopic={paramTopic}
        articles={articles}
      />
    </>
  );
}

export default AllArticles;

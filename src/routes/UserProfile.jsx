import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import {
  fetchArticlesByUsername,
  fetchUserByUsername,
  patchArticle,
} from "../api/api";
import ArticleCard from "../components/ArticleCard";
import { UserContext } from "../contexts/UserContext";
import { computeVoteUpdate } from "../utils/voting";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoadingUser, setLoadingUser] = useState(true);
  const [isLoadingArticles, setLoadingArticles] = useState(false);
  const [articlesError, setArticlesError] = useState(null);
  const [votingArticleIds, setVotingArticleIds] = useState([]);
  const { loggedInUser } = useContext(UserContext);
  const [pageStart, setPageStart] = useState(0);

  useEffect(() => {
    setLoadingUser(true);
    fetchUserByUsername(username)
      .then((data) => {
        setUser(data.user);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, [username]);

  useEffect(() => {
    setLoadingArticles(true);
    fetchArticlesByUsername(username)
      .then((data) => {
        setArticles(data.articles);
        setArticlesError(null);
      })
      .catch((err) => {
        setArticlesError(err.message);
      })
      .finally(() => {
        setLoadingArticles(false);
      });
  }, [username]);

  const handleVote = (article_id, vote) => {
    const article = articles.find(
      (article) => article.article_id === article_id
    );
    if (!article) return;

    const { voteChange, newUserVote } = computeVoteUpdate(
      article.userVote,
      vote
    );

    const originalArticle = { ...article };

    setArticles((currArticles) =>
      currArticles.map((article) =>
        article.article_id === article_id
          ? {
              ...article,
              votes: article.votes + voteChange,
              userVote: newUserVote,
            }
          : article
      )
    );

    setVotingArticleIds((prev) => [...prev, article_id]);

    patchArticle(article_id, voteChange)
      .catch(() => {
        setArticles((currArticles) =>
          currArticles.map((article) =>
            article.article_id === article_id ? originalArticle : article
          )
        );
        setError("Failed to register vote :(");
      })
      .finally(() => {
        setVotingArticleIds((prev) => prev.filter((id) => id !== article_id));
      });
  };

  if (error)
    return (
      <section className="error-block">
        <p>Error: {error}</p>
      </section>
    );

  if (isLoadingUser) return <p>Loading user profile...</p>;

  return (
    <>
      {user?.username && (
        <section className="user-profile">
          <img
            className="user-avatar"
            src={user.avatar_url}
            alt={`${user.username} avatar`}
          />
          <section className="profile-fields">
            <h2>{user.username}</h2>
            <p>Name: {user.name}</p>
          </section>
        </section>
      )}

      {user?.username && (
        <section className="user-articles">
          <h3>Articles by {user.username}</h3>

          {isLoadingArticles && <p>Loading articles...</p>}
          {articlesError && <p>Error loading articles: {articlesError}</p>}
          {!isLoadingArticles && articles.length === 0 && (
            <p>No articles found.</p>
          )}

          {articles.slice(pageStart, pageStart + 5).map((article) => (
            <ArticleCard
              key={article.article_id}
              article={article}
              onVote={handleVote}
              isVoting={votingArticleIds.includes(article.article_id)}
              currentUser={loggedInUser}
            />
          ))}
        </section>
      )}

      <section className="page-nav">
        <button
          id="prev-page"
          disabled={pageStart === 0}
          onClick={() => setPageStart(pageStart - 5)}
        >
          Previous Page
        </button>
        <p id="page-number">Page: {Math.floor(pageStart / 5) + 1}</p>
        <button
          id="next-page"
          disabled={pageStart + 5 >= articles.length}
          onClick={() => setPageStart(pageStart + 5)}
        >
          Next Page
        </button>
      </section>
    </>
  );
}

export default UserProfile;

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
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";
import { useFetch } from "../hooks/useFetch";

function UserProfile() {
  const { username } = useParams();
  const { loggedInUser } = useContext(UserContext);

  const {
    data: userData,
    error: userError,
    loading: isLoadingUser,
  } = useFetch(fetchUserByUsername, [username], [username]);

  const {
    data: articlesData,
    error: articlesError,
    loading: isLoadingArticles,
  } = useFetch(fetchArticlesByUsername, [username], [username]);

  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [pageStart, setPageStart] = useState(0);
  const [error, setError] = useState(null);
  const [votingArticleIds, setVotingArticleIds] = useState([]);
  const [articleKarma, setArticleKarma] = useState(0);

  useEffect(() => {
    if (userData) {
      setUser(userData.user);
    }
  }, [userData]);

  useEffect(() => {
    if (articlesData) {
      setArticles(articlesData.articles);
      setArticleKarma(
        articlesData.articles.reduce((acc, obj) => acc + obj.votes, 0)
      );
    }
  }, [articlesData]);

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

    setArticles((curr) =>
      curr.map((article) =>
        article.article_id === article_id
          ? {
              ...article,
              votes: article.votes + voteChange,
              userVote: newUserVote,
            }
          : article
      )
    );
    setArticleKarma((prev) => prev + voteChange);

    setVotingArticleIds((prev) => [...prev, article_id]);

    patchArticle(article_id, voteChange)
      .catch(() => {
        setArticles((curr) =>
          curr.map((article) =>
            article.article_id === article_id ? originalArticle : article
          )
        );
        setError("Failed to register vote :(");
        setArticleKarma((prev) => prev - voteChange);
      })
      .finally(() => {
        setVotingArticleIds((prev) => prev.filter((id) => id !== article_id));
      });
  };

  if (userError || error) {
    return <Error message={userError || error} />;
  }

  if (isLoadingUser) {
    return <Loading field={"user profile..."} />;
  }

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
            <p>
              <span className="profile-key">Name:</span> {user.name}
            </p>
            <p>
              <span className="profile-key">Articles Posted:</span>{" "}
              {articles.length}
            </p>
            <p>
              <span className="profile-key">Article Karma:</span> {articleKarma}
            </p>
          </section>
        </section>
      )}

      {user?.username && (
        <section className="user-articles">
          <h3>Articles by {user.username}</h3>

          {isLoadingArticles && <Loading field={"articles"} />}
          {articlesError && (
            <Error message={`cannot load articles, ${articlesError}`} />
          )}
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

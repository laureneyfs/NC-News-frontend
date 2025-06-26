import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArticlesByUsername, fetchUserByUsername } from "../api/api";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoadingUser, setLoadingUser] = useState(true);
  const [isLoadingArticles, setLoadingArticles] = useState(null);
  const [articlesError, setArticlesError] = useState(null);

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
          <h2>{user.username}</h2>
          <p>Name: {user.name}</p>
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

          {articles.map((article) => (
            <section className="article" key={article.article_id}>
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
                  by{" "}
                  <Link to={`/users/${article.author}`}>{article.author}</Link>
                </h3>
                <p>
                  topic:{" "}
                  <Link to={`/topics/${article.topic}`}>{article.topic}</Link> |
                  posted: {new Date(article.created_at).toLocaleString()}
                </p>
                <p>{article.comment_count} comments</p>
              </section>
            </section>
          ))}
        </section>
      )}
    </>
  );
}

export default UserProfile;

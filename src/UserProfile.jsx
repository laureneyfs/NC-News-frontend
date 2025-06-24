import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function UserProfile() {
  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoadingUser, setLoadingUser] = useState(null);
  const [isLoadingArticles, setLoadingArticles] = useState(null);
  const [articlesError, setArticlesError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const res = await fetch(
          `https://nc-news-3uk2.onrender.com/api/users/${username}`
        );
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data.user);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, [username]);

  useEffect(() => {
    const fetchArticlesByUser = async () => {
      try {
        setLoadingArticles(true);
        const res = await fetch(
          `https://nc-news-3uk2.onrender.com/api/articles?author=${username}`
        );
        if (!res.ok) throw new Error("Failed to fetch articles");
        const data = await res.json();
        setArticles(data.articles);
        setArticlesError(null);
      } catch (err) {
        setArticlesError(err.message);
      } finally {
        setLoadingArticles(false);
      }
    };

    fetchArticlesByUser();
  }, [username]);

  if (error) return <p>Error: {error}</p>;
  if (isLoadingUser) return <p>Loading user profile...</p>;
  if (!user) return <p>No user found.</p>;

  return (
    <>
      <section className="user-profile">
        <img
          className="user-avatar"
          src={user.avatar_url}
          alt={`${user.username} avatar`}
        />
        <h2>{user.username}</h2>
        <p>Name: {user.name}</p>
      </section>

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
                by <Link to={`/users/${article.author}`}>{article.author}</Link>
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
    </>
  );
}

export default UserProfile;

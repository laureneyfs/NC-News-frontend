import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import Comments from "../components/ArticleComments";
import { Link } from "react-router";
import { UserContext } from "../contexts/UserContext";

function SingleArticle() {
  const [article, setArticle] = useState(null);
  const { articleid } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://nc-news-3uk2.onrender.com/api/articles/${articleid}`
        );
        if (!res.ok) throw new Error("Failed to fetch article");

        const data = await res.json();
        setArticle(data.article);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articleid]);

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
        <p>Loading article...</p>
      </section>
    );
  }
  if (!article) {
    return (
      <section className="article">
        <p>No article found.</p>
      </section>
    );
  }

  return (
    <>
      <section className="specific-article-item">
        <h2>{article.title}</h2>
        <img className="article-image" src={article.article_img_url}></img>

        <h3>
          Author: <Link to={`/user/${article.author}`}>{article.author}</Link> |
          Posted: {new Date(article.created_at).toLocaleString()}
        </h3>
        <p>topic: {article.topic}</p>
        <section className="article-body">
          <section className="vote-block">
            <button>↑</button>
            <p>{article.votes}</p>
            <button>↓</button>
          </section>
          <p>{article.body}</p>
        </section>
      </section>
      <Comments articleid={articleid} />
    </>
  );
}

export default SingleArticle;

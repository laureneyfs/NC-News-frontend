import { useEffect, useState } from "react";
import { Link } from "react-router";

function AllArticles() {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    setLoading(true);

    const fetchArticles = async () => {
      try {
        const res = await fetch(
          `https://nc-news-3uk2.onrender.com/api/articles`
        );
        if (!res.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await res.json();
        console.log(data);
        setArticles(data.articles);
        setError(null);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    };
    fetchArticles();
  }, []);
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
        <div className="article" key={article.article_id}>
          <h3>
            <Link to={`/articles/${article.article_id}`}>{article.title}</Link>{" "}
            by {article.author}
          </h3>
          <p>
            topic: {article.topic} | posted: {article.created_at}
          </p>
          <p>
            comments: {article.comment_count} | votes: {article.votes}
          </p>
        </div>
      ))}
    </>
  );
}

export default AllArticles;

//todo: look into load handling, look into !articles handling, hyperlink
//look into date formatting - maybe helper function?

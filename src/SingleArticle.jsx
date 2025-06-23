import { useEffect, useState } from "react";
import { useParams } from "react-router";

function SingleArticle() {
  const [article, setArticle] = useState(null);
  const { articleid } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const articleRes = await fetch(
          `https://nc-news-3uk2.onrender.com/api/articles/${articleid}`
        );
        if (!articleRes.ok) {
          throw new Error("Failed to fetch article");
        }
        const articleData = await articleRes.json();
        setArticle(articleData.article);

        const commentsRes = await fetch(
          `https://nc-news-3uk2.onrender.com/api/articles/${articleid}/comments`
        );
        if (!commentsRes.ok) {
          throw new Error("Failed to fetch comments");
        }
        const commentsData = await commentsRes.json();
        setComments(commentsData.comments);

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
          Author: {article.author} | posted: {article.created_at}
        </h3>
        <p>topic: {article.topic}</p>

        <section className="article-body">
          <p>{article.body}</p>
        </section>
      </section>
      <h3 className="comment-count">Displaying {comments?.length} comments</h3>
      <section className="comments-section">
        {comments.map((comment) => (
          <section className="comment" key={comment.comment_id}>
            <p>
              <span>{comment.votes} Votes | </span>
              {comment.author}
            </p>
            <p>{comment.body}</p>
          </section>
        ))}
      </section>
    </>
  );
}

export default SingleArticle;

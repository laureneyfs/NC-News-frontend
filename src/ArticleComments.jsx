import { useEffect, useState } from "react";
import { Link } from "react-router";

function Comments({ articleid }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://nc-news-3uk2.onrender.com/api/articles/${articleid}/comments`
        );
        if (!res.ok) throw new Error("Failed to fetch comments");

        const data = await res.json();
        setComments(data.comments);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [articleid]);

  if (error) return <p>Error loading comments: {error}</p>;
  if (isLoading) return <p>Loading comments...</p>;

  return (
    <>
      <h3 className="comment-count">Displaying {comments.length} comments</h3>
      <section className="comments-section">
        {comments.map((comment) => (
          <section className="comment" key={comment.comment_id}>
            <section className="vote-block">
              <button>up</button>
              <button>down</button>
            </section>
            <section className="comment-body">
              <p>
                <Link to={`/users/${comment.author}`} className="username">
                  {comment.author}
                </Link>{" "}
                - {comment.votes} Votes -{" "}
                {new Date(comment.created_at).toLocaleString()}
              </p>
              <p>{comment.body}</p>
            </section>
          </section>
        ))}
      </section>
    </>
  );
}

export default Comments;

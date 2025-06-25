import { useState, useContext, useEffect } from "react";
import { Link } from "react-router";
import CreateComment from "./CreateComment";
import { UserContext } from "../contexts/UserContext";

function Comments({ articleid }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState([]);
  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://nc-news-3uk2.onrender.com/api/articles/${articleid}/comments`
        );
        if (!res.ok) throw new Error("Failed to fetch comments");
        const data = await res.json();
        setComments(
          data.comments.map((comment) => ({ ...comment, userVote: 0 }))
        );
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [articleid]);

  if (error) {
    return (
      <section className="comments-section">
        <p>Error loading comments: {error}</p>
      </section>
    );
  }
  if (isLoading) {
    return (
      <section className="comments-section">
        <p>Loading comments...</p>
      </section>
    );
  }

  function patchComment(comment_id, vote) {
    setLoadingComments((ids) => [...ids, comment_id]);
    return fetch(
      `https://nc-news-3uk2.onrender.com/api/comments/${comment_id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ inc_votes: vote }),
        headers: { "Content-type": "application/json" },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("vote failed!");
        return res.json();
      })
      .catch(() => {
        setComments((currComments) =>
          currComments.map((comment) =>
            comment.comment_id === comment_id
              ? {
                  ...comment,
                  votes: comment.votes - vote,
                  userVote: comment.userVote,
                }
              : comment
          )
        );
      })
      .finally(() => {
        setLoadingComments((ids) => ids.filter((id) => id !== comment_id));
      });
  }

  function handleVote(comment_id, vote) {
    setComments((currComments) =>
      currComments.map((comment) => {
        if (comment.comment_id !== comment_id) return comment;
        let newUserVote = comment.userVote || 0;
        let voteChange = 0;
        if (vote === newUserVote) {
          voteChange = -vote;
          newUserVote = 0;
        } else if (newUserVote === 0) {
          voteChange = vote;
          newUserVote = vote > 0 ? 1 : -1;
        } else {
          voteChange = vote * 2;
          newUserVote = vote > 0 ? 1 : -1;
        }
        patchComment(comment_id, voteChange);
        return {
          ...comment,
          votes: comment.votes + voteChange,
          userVote: newUserVote,
        };
      })
    );
  }

  function deleteComment(comment_id) {
    setComments((curr) =>
      curr.map((comment) =>
        comment.comment_id === comment_id
          ? { ...comment, deleting: true }
          : comment
      )
    );
    return fetch(
      `https://nc-news-3uk2.onrender.com/api/comments/${comment_id}`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("vote failed!");
        setComments((currComments) =>
          currComments.filter((comment) => comment.comment_id !== comment_id)
        );
      })
      .catch((err) => {
        return <p>Error deleting comment: {err}</p>;
      });
  }

  return (
    <>
      <CreateComment
        articleid={articleid}
        onCommentPosted={(newComment) =>
          setComments((curr) => [{ ...newComment, isNew: true }, ...curr])
        }
      />
      <h3 className="comment-count">Displaying {comments.length} comments</h3>
      <section className="comments-section">
        {comments.map((comment) => (
          <section
            className={`comment ${comment.isNew ? "new-comment" : ""} ${
              comment.deleting ? "comment-deleting" : ""
            }`}
            key={comment.comment_id}
          >
            <section className="vote-block">
              <button
                onClick={() => handleVote(comment.comment_id, 1)}
                disabled={
                  loadingComments.includes(comment.comment_id) ||
                  comment.deleting
                }
                className={comment.userVote === 1 ? "upvoted" : ""}
              >
                ↑
              </button>
              <p>{comment.votes}</p>
              <button
                onClick={() => handleVote(comment.comment_id, -1)}
                disabled={
                  loadingComments.includes(comment.comment_id) ||
                  comment.deleting
                }
                className={comment.userVote === -1 ? "downvoted" : ""}
              >
                ↓
              </button>
            </section>
            <section className="comment-body">
              <p>
                <Link to={`/users/${comment.author}`} className="username">
                  {comment.author}
                </Link>{" "}
                | Posted: {new Date(comment.created_at).toLocaleString()}
                {loggedInUser?.username === comment.author &&
                  !comment.deleting && (
                    <button
                      onClick={() => deleteComment(comment.comment_id)}
                      className="delete-comment"
                      disabled={comment.deleting}
                    >
                      delete
                    </button>
                  )}
                {comment.deleting && (
                  <span className="deleting-text">Deleting...</span>
                )}
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

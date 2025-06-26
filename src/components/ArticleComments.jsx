import { useState, useContext, useEffect } from "react";
import { Link } from "react-router";
import CreateComment from "./CreateComment";
import { UserContext } from "../contexts/UserContext";
import { patchComment, deleteComment, fetchComments } from "../api/api";

function Comments({ articleid, articleauthor }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState([]);
  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    setLoading(true);
    fetchComments(articleid)
      .then((data) => {
        setComments(
          data.comments.map((comment) => ({ ...comment, userVote: 0 }))
        );
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
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
        setLoadingComments((ids) => [...ids, comment_id]);
        patchComment(comment_id, voteChange)
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
        return {
          ...comment,
          votes: comment.votes + voteChange,
          userVote: newUserVote,
        };
      })
    );
  }

  function handleDelete(comment_id) {
    setComments((curr) =>
      curr.map((comment) =>
        comment.comment_id === comment_id
          ? { ...comment, deleting: true }
          : comment
      )
    );
    deleteComment(comment_id)
      .then(() => {
        setComments((currComments) =>
          currComments.filter((comment) => comment.comment_id !== comment_id)
        );
      })

      .catch((err) => {
        setComments((curr) =>
          curr.map((comment) =>
            comment.comment_id === comment_id
              ? { ...comment, deleting: false, error: "Failed to delete" }
              : comment
          )
        );
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
                {articleauthor === comment.author && (
                  <>
                    <span className="article-poster">OP</span> |{" "}
                  </>
                )}
                <Link to={`/users/${comment.author}`} className="username">
                  {comment.author}
                </Link>{" "}
                | Posted: {new Date(comment.created_at).toLocaleString()}
                {loggedInUser?.username === comment.author &&
                  !comment.deleting && (
                    <button
                      onClick={() => handleDelete(comment.comment_id)}
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

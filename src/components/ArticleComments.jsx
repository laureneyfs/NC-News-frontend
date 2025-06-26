import { useState, useContext, useEffect } from "react";
import CreateComment from "./CreateComment";
import { UserContext } from "../contexts/UserContext";
import { patchComment, deleteComment, fetchComments } from "../api/api";
import CommentCard from "./CommentCard";

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
          <CommentCard
            key={comment.comment_id}
            comment={comment}
            articleauthor={articleauthor}
            loggedInUser={loggedInUser}
            onDelete={handleDelete}
            onVote={handleVote}
            isLoading={loadingComments.includes(comment.comment_id)}
          />
        ))}
      </section>
    </>
  );
}

export default Comments;

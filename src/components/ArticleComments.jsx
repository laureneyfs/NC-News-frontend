import { useState, useContext, useEffect } from "react";
import CreateComment from "./CreateComment";
import { UserContext } from "../contexts/UserContext";
import { patchComment, deleteComment, fetchComments } from "../api/api";
import CommentCard from "./CommentCard";
import { computeVoteUpdate } from "../utils/voting";
import { Loading } from "./Loading";

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
      <>
        <Error message={error} />
      </>
    );
  }
  if (isLoading) {
    return (
      <>
        <Loading field={"comments"} />
      </>
    );
  }
  function handleVote(comment_id, vote) {
    setComments((currComments) => {
      const updatedComments = currComments.map((comment) => {
        if (comment.comment_id !== comment_id) return comment;

        const { voteChange, newUserVote } = computeVoteUpdate(
          comment.userVote,
          vote
        );

        return {
          ...comment,
          votes: comment.votes + voteChange,
          userVote: newUserVote,
        };
      });

      const updatedComment = updatedComments.find(
        (comment) => comment.comment_id === comment_id
      );
      if (updatedComment) {
        setLoadingComments((ids) => [...ids, comment_id]);

        patchComment(
          comment_id,
          updatedComment.votes -
            currComments.find((comment) => comment.comment_id === comment_id)
              .votes
        )
          .catch(() => {
            setComments((curr) =>
              curr.map((comment) =>
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

      return updatedComments;
    });
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
      {comments.length === 0 ? (
        <>
          <h3 className="comment-count">
            This article has no comments...yet! Be the first!
          </h3>
          <CreateComment
            articleid={articleid}
            onCommentPosted={(newComment) =>
              setComments((curr) => [{ ...newComment, isNew: true }, ...curr])
            }
          />
        </>
      ) : (
        <>
          {" "}
          <CreateComment
            articleid={articleid}
            onCommentPosted={(newComment) =>
              setComments((curr) => [{ ...newComment, isNew: true }, ...curr])
            }
          />
          <h3 className="comment-count">
            Displaying {comments.length} comments
          </h3>
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
      )}
    </>
  );
}

export default Comments;

import { Link } from "react-router";

function CommentCard({
  comment,
  articleauthor,
  loggedInUser,
  onDelete,
  onVote,
  isLoading,
}) {
  const isAuthor = loggedInUser?.username === comment.author;
  const isOP = articleauthor === comment.author;

  return (
    <section
      className={`comment ${comment.isNew ? "new-comment" : ""} ${
        comment.deleting ? "comment-deleting" : ""
      }`}
    >
      <section className="vote-block">
        <button
          onClick={() => onVote(comment.comment_id, 1)}
          disabled={isLoading || comment.deleting}
          className={comment.userVote === 1 ? "upvoted" : ""}
        >
          ↑
        </button>
        <p className="vote-count">{comment.votes}</p>
        <button
          onClick={() => onVote(comment.comment_id, -1)}
          disabled={isLoading || comment.deleting}
          className={comment.userVote === -1 ? "downvoted" : ""}
        >
          ↓
        </button>
      </section>
      <section className="comment-body">
        <div className="comment-header">
          <p>
            {isOP && (
              <>
                <span className="article-poster">OP</span> |{" "}
              </>
            )}
            <Link to={`/users/${comment.author}`} className="username">
              {comment.author}
            </Link>{" "}
            | Posted: {new Date(comment.created_at).toLocaleString()}
          </p>
          {isAuthor && !comment.deleting && (
            <button
              onClick={() => onDelete(comment.comment_id)}
              className="delete-button"
              disabled={comment.deleting}
            >
              Delete?
            </button>
          )}
          {comment.deleting && (
            <span className="deleting-text">Deleting...</span>
          )}
        </div>
        <p>{comment.body}</p>
      </section>
    </section>
  );
}

export default CommentCard;

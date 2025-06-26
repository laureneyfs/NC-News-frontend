import { Link } from "react-router-dom";

function ArticleCard({
  article,
  isDeleting,
  isVoting,
  onVote,
  onDelete,
  currentUser,
  deleteError,
}) {
  const {
    article_id,
    article_img_url,
    title,
    author,
    topic,
    created_at,
    comment_count,
    votes,
    userVote,
  } = article;

  const canVote = currentUser?.username !== author && !isVoting;
  const isAuthor = currentUser?.username === author;

  return (
    <section className={`article ${isDeleting ? "deleting" : ""}`}>
      <section className="vote-block">
        <button
          onClick={() => onVote(article_id, 1)}
          disabled={!canVote}
          className={userVote === 1 ? "upvoted" : ""}
        >
          ↑
        </button>
        <p
          className={
            "vote-count" +
            (votes < -4 ? " negative-vote-count" : "") +
            (votes > 24 ? " popular-post" : "")
          }
        >
          {votes < 1000 ? votes : `${(votes / 1000).toFixed(1)}k`}
        </p>
        <button
          onClick={() => onVote(article_id, -1)}
          disabled={!canVote}
          className={userVote === -1 ? "downvoted" : ""}
        >
          ↓
        </button>
      </section>
      <img
        className="all-articles-image"
        src={article_img_url}
        alt={title || "Article image"}
      />
      <section className="article-fields">
        <h3>
          <Link to={`/articles/${article_id}`}>{title}</Link> by{" "}
          <Link to={`/users/${author}`}>{author}</Link>
        </h3>
        <p>
          <span className="article-key">topic:</span>{" "}
          <Link to={`/topics/${topic}`}>{topic}</Link> |{" "}
          <span className="article-key">posted:</span>{" "}
          {new Date(created_at).toLocaleString()}
        </p>

        <p>{comment_count} comments</p>
        {isAuthor && (
          <button onClick={() => onDelete(article_id)} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        )}
        {deleteError && (
          <p className="error">unable to delete article: {deleteError}</p>
        )}
      </section>
    </section>
  );
}

export default ArticleCard;

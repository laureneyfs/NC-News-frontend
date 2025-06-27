import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import Comments from "../components/ArticleComments";
import { Link } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { patchArticle, fetchArticleById, deleteArticle } from "../api/api";
import { computeVoteUpdate } from "../utils/voting";
import { useNavigate } from "react-router";
import { useFetch } from "../hooks/useFetch";
import { Loading } from "../components/Loading";
import { Error } from "../components/Error";

function SingleArticle() {
  const [article, setArticle] = useState(null);
  const { articleid } = useParams();
  const { loggedInUser } = useContext(UserContext);
  const [isVoting, setIsVoting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const { data, error, loading } = useFetch(
    fetchArticleById,
    [articleid],
    [articleid]
  );

  useEffect(() => {
    if (data) {
      setArticle(data.article);
    }
  }, [data]);

  function handleDelete(article_id) {
    setDeleteLoading(true);
    deleteArticle(article_id)
      .then(() => {
        setArticle(null);
        setIsDeleted(true);
      })
      .catch((err) => {
        setDeleteError(true);
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  }

  function handleVote(article_id, vote) {
    setIsVoting(true);

    const { voteChange, newUserVote } = computeVoteUpdate(
      article.userVote,
      vote
    );

    const optimisticArticle = {
      ...article,
      votes: article.votes + voteChange,
      userVote: newUserVote,
    };

    setArticle(optimisticArticle);

    patchArticle(article_id, voteChange)
      .catch(() => {
        setArticle({
          ...article,
          userVote: article.userVote || 0,
          votes: article.votes,
        });
        setError("Failed to register vote :(");
      })
      .finally(() => {
        setIsVoting(false);
      });
  }
  if (isDeleted) {
    return (
      <section className="article">
        <h2>Article deleted successfully</h2>
        <button className="deleted-article-button" onClick={() => navigate(-1)}>
          Back
        </button>
        <Link to="/">
          <button className="deleted-article-button">Home</button>
        </Link>
      </section>
    );
  }
  if (error) {
    return <Error message={error} />;
  }

  if (loading) {
    return <Loading field={"article"} />;
  }
  if (!article) {
    return (
      <section className="article">
        <h2>No article found.</h2>
      </section>
    );
  }

  return (
    <>
      <section
        className={`specific-article-item ${deleteLoading ? "deleting" : ""}`}
      >
        <h2>{article.title}</h2>
        <img className="article-image" src={article.article_img_url}></img>

        <h3>
          Author: <Link to={`/user/${article.author}`}>{article.author}</Link> |
          Posted: {new Date(article.created_at).toLocaleString()}
        </h3>
        <h4>
          topic: <Link to={`/topics/${article.topic}`}>{article.topic}</Link>
        </h4>
        <section className="article-body">
          <section className="vote-block">
            <button
              onClick={() => handleVote(article.article_id, 1)}
              disabled={
                loggedInUser?.username === article.author || isVoting === true
              }
              className={article.userVote === 1 ? "upvoted" : ""}
            >
              ↑
            </button>
            <p>{article.votes}</p>
            <button
              onClick={() => handleVote(article.article_id, -1)}
              disabled={
                loggedInUser?.username === article.author || isVoting === true
              }
              className={article.userVote === -1 ? "downvoted" : ""}
            >
              ↓
            </button>
          </section>
          <p>{article.body}</p>
        </section>
        {loggedInUser === article.author && (
          <button
            onClick={() => handleDelete(article.article_id)}
            disabled={deleteLoading}
          >
            Delete Article
          </button>
        )}
        {deleteError && <p className="error">Failed to delete!</p>}
        {deleteLoading && <p className="error">Deleting...</p>}
      </section>
      <Comments articleid={articleid} articleauthor={article.author} />
    </>
  );
}

export default SingleArticle;

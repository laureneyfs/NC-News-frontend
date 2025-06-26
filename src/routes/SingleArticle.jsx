import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import Comments from "../components/ArticleComments";
import { Link } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { patchArticle, fetchArticleById } from "../api/api";
import { computeVoteUpdate } from "../utils/voting";

function SingleArticle() {
  const [article, setArticle] = useState(null);
  const { articleid } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { loggedInUser } = useContext(UserContext);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchArticleById(articleid)
      .then((data) => {
        setArticle(data.article);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [articleid]);

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
      </section>
      <Comments articleid={articleid} articleauthor={article.author} />
    </>
  );
}

export default SingleArticle;

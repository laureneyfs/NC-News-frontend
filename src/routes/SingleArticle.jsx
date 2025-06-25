import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import Comments from "../components/ArticleComments";
import { Link } from "react-router";
import { UserContext } from "../contexts/UserContext";

function SingleArticle() {
  const [article, setArticle] = useState(null);
  const { articleid } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { loggedInUser } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://nc-news-3uk2.onrender.com/api/articles/${articleid}`
        );
        if (!res.ok) throw new Error("Failed to fetch article");

        const data = await res.json();
        setArticle(data.article);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [articleid]);

  function patchArticle(article_id, voteChange) {
    return fetch(
      `https://nc-news-3uk2.onrender.com/api/articles/${article_id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ inc_votes: voteChange }),
        headers: { "Content-type": "application/json" },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("vote failed!");
        return res.json();
      })
      .catch(() => {
        setArticle((currArticle) =>
          currArticle.map((article) =>
            article.article_id === article_id
              ? { ...article, votes: article.votes - voteChange, userVote: 0 }
              : article
          )
        );
      });
  }
  function handleVote(article_id, vote) {
    setArticle(() => {
      let newUserVote = article.userVote || 0;
      let voteChange = 0;
      if (vote === newUserVote) {
        voteChange -= vote;
        newUserVote = 0;
      } else if (newUserVote === 0) {
        voteChange = vote;
        newUserVote = vote > 0 ? 1 : -1;
      } else {
        voteChange = vote * 2;
        newUserVote = vote > 0 ? 1 : -1;
      }
      patchArticle(article_id, voteChange);
      return {
        ...article,
        votes: article.votes + voteChange,
        userVote: newUserVote,
      };
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
              disabled={loggedInUser?.username === article.author}
              className={article.userVote === 1 ? "upvoted" : ""}
            >
              ↑
            </button>
            <p>{article.votes}</p>
            <button
              onClick={() => handleVote(article.article_id, -1)}
              disabled={loggedInUser?.username === article.author}
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

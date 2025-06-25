import { useState, useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import { useNavigate } from "react-router";

function CreateComment({ articleid, onCommentPosted }) {
  const [commentBody, setCommentBody] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState(null);
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  function changeComment(e) {
    console.log(e.target.value);
    setCommentBody(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoadingComments(true);
    setError(null);
    postComment()
      .then((data) => {
        console.log(data);
        console.log("Comment posted:", data);
        setCommentBody("");
        if (onCommentPosted) onCommentPosted(data.newComment);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoadingComments(false));
  }

  function postComment() {
    return fetch(
      `https://nc-news-3uk2.onrender.com/api/articles/${articleid}/comments`,
      {
        method: "POST",
        body: JSON.stringify({
          article_id: articleid,
          body: commentBody,
          username: loggedInUser.username,
        }),
        headers: { "Content-type": "application/json" },
      }
    ).then((res) => {
      if (!res.ok) throw new Error("post failed!");
      return res.json();
    });
  }

  return (
    <section className="comments-section">
      <h3>Reply to Article</h3>
      {loggedInUser ? (
        <form onSubmit={handleSubmit}>
          <textarea
            name="postContent"
            rows={5}
            cols={50}
            value={commentBody}
            onChange={changeComment}
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <>
          <h4>Log in to Reply to Article</h4>
          <button onClick={() => navigate(`/login`)}>Log in</button>
        </>
      )}
    </section>
  );
}

export default CreateComment;

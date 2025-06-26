import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import { postComment } from "../api/api";

function CreateComment({ articleid, onCommentPosted }) {
  const [commentBody, setCommentBody] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState(null);
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  function changeComment(e) {
    setCommentBody(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoadingComments(true);
    setError(null);
    postComment(articleid, commentBody, loggedInUser)
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

  return (
    <section className="comments-section">
      {loggedInUser ? (
        <form onSubmit={handleSubmit}>
          <h3>Reply to article</h3>
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
          <h4>Log in to reply to article</h4>
          <button onClick={() => navigate(`/login`)}>Log in</button>
        </>
      )}
    </section>
  );
}

export default CreateComment;

import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router";
import { postComment } from "../api/api";

function CreateComment({ articleid, onCommentPosted }) {
  const [commentBody, setCommentBody] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [error, setError] = useState(null);
  const { loggedInUser } = useContext(UserContext);
  const [formError, setFormError] = useState(null);

  const navigate = useNavigate();

  function changeComment(e) {
    setCommentBody(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!loggedInUser) {
      setError("You must be logged in to post a comment.");
      return;
    }
    const trimmed = commentBody.trim();
    if (!trimmed) {
      setFormError(true);
      return;
    }
    setLoadingComments(true);
    setError(null);
    setFormError(null);
    postComment(articleid, commentBody, loggedInUser)
      .then((data) => {
        console.log("Comment posted:", data);
        setCommentBody("");
        onCommentPosted(data.newComment);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoadingComments(false));
  }

  return (
    <>
      {loggedInUser ? (
        <section className="create-comment">
          <h3 className="content-descriptor">Reply to article</h3>
          <form onSubmit={handleSubmit}>
            <div className="field-and-submit">
              <textarea
                name="postContent"
                rows={5}
                cols={50}
                value={commentBody}
                onChange={changeComment}
              />
              {formError && (
                <p className="error">You cannot post a blank comment!</p>
              )}
              <button type="submit" disabled={loadingComments}>
                Submit
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section
          onClick={() => navigate(`/login`)}
          className="create-comment clickable"
        >
          <h4 className="content-descriptor">Log in to reply to article</h4>
        </section>
      )}
    </>
  );
}

export default CreateComment;

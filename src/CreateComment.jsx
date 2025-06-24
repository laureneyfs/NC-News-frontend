import { useState } from "react";

function CreateComment() {
  const [commentBody, setCommentBody] = useState("");

  function changeComment(e) {
    console.log(e.target.value);
    setCommentBody(e.target.value);
  }
  return (
    <section className="comments-section">
      <h3>Reply to Article</h3>
      <form>
        <textarea
          name="postContent"
          rows={5}
          cols={50}
          value={commentBody}
          onChange={changeComment}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </section>
  );
}

export default CreateComment;

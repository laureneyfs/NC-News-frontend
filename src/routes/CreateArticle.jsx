import { UserContext } from "../contexts/UserContext";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { postArticle } from "../api/api";

function CreateArticle() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    image: "",
    body: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!loggedInUser) {
      setError("You must be logged in to post an article.");
      return;
    }
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    setProcessing(true);
    setError(null);
    setFormErrors({});
    const { title, topic, body, image } = formData;
    postArticle(title, topic, body, loggedInUser, image)
      .then((data) => {
        navigate(`/articles/${data.createdArticle.article_id}`);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setProcessing(false));
  }

  function validateForm() {
    const errors = {};
    const imageRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i;
    const { title, topic, body, image } = formData;
    if (title.trim().length < 5)
      errors.title = "Title must be at least 5 characters";
    if (!topic.trim()) errors.topic = "Topic is required";
    if (body.trim().length < 20)
      errors.body = "Body must be at least 20 characters";
    if (image && !imageRegex.test(image)) {
      errors.image = "Must be a valid URL to an image";
    }
    return errors;
  }
  return (
    <section id="create-article">
      <h2>Create an Article</h2>
      {loggedInUser ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="article-title">Title</label>
          <input
            type="text"
            name="title"
            id="article-title"
            value={formData.title}
            onChange={handleChange}
          />
          {formErrors.title && <p className="error">{formErrors.title}</p>}
          <label htmlFor="article-topic">Topic</label>
          <input
            type="text"
            name="topic"
            id="article-topic"
            value={formData.topic}
            onChange={handleChange}
          />
          {formErrors.topic && <p className="error">{formErrors.topic}</p>}
          <label htmlFor="article-image">Image</label>
          <input
            type="text"
            name="image"
            id="article-image"
            value={formData.image}
            onChange={handleChange}
          />
          {formErrors.image && <p className="error">{formErrors.image}</p>}
          <label htmlFor="article-body">Body</label>
          <textarea
            name="body"
            id="article-body"
            rows="5"
            cols="33"
            value={formData.body}
            onChange={handleChange}
          />
          {formErrors.body && <p className="error">{formErrors.body}</p>}
          <button type="submit">Submit</button>
          {processing && <p className="processing">Creating Article...</p>}
        </form>
      ) : (
        <>
          <h4>Log in to create an article!</h4>
          <button onClick={() => navigate(`/login`)}>Log in</button>
        </>
      )}
    </section>
  );
}

export default CreateArticle;

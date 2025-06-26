import { useState, useEffect } from "react";
import { Link } from "react-router";
import { fetchTopics } from "../api/api";

function Topics() {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetchTopics()
      .then((data) => {
        setTopics(data.topics);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
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
        <p>Loading articles...</p>
      </section>
    );
  }
  return (
    <>
      {topics.map((topic) => (
        <Link
          to={`/topics/${topic.slug}`}
          key={topic.slug}
          className="link-no-decoration"
        >
          <section className="topic-wrapper">
            <h2>{topic.slug}</h2>

            <p>{topic.description}</p>
          </section>
        </Link>
      ))}
    </>
  );
}

export default Topics;

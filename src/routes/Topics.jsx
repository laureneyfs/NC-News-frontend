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
        <section className="article" key={topic.slug}>
          <Link to={`/topics/${topic.slug}`}>
            <h2>{topic.slug}</h2>
          </Link>
          <p>{topic.description}</p>
        </section>
      ))}
    </>
  );
}

export default Topics;

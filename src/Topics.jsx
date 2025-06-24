import { useState, useEffect } from "react";
import { Link } from "react-router";

function Topics() {
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://nc-news-3uk2.onrender.com/api/topics`);
        if (!res.ok) throw new Error("Something went wrong!");
        const data = await res.json();
        setTopics(data.topics);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
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

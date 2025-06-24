import { useParams } from "react-router";
import { useState, useEffect } from "react";

function Topic() {
  const { topic } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // const res = await fetch(
        //   `https://nc-news-3uk2.onrender.com/api/${topic}`
        // );
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
  }, [topic]);

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
  return <p>test</p>;
}

export default Topic;

//WIP

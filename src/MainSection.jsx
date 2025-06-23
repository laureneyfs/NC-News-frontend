import { useState } from "react";
import { Routes, Route } from "react-router";
import AllArticles from "./AllArticles";
import SingleArticle from "./SingleArticle";

function MainSection({ queries }) {
  const [isError, setError] = useState(false);
  return (
    <main>
      <h2>Welcome!</h2>
      <Routes>
        <Route path="/" element={<AllArticles />} queries={queries} />
        <Route path="/articles" element={<AllArticles />} queries={queries} />
        <Route
          path="/articles/:articleid"
          element={<SingleArticle />}
          queries={queries}
        />
      </Routes>
    </main>
  );
}

export default MainSection;

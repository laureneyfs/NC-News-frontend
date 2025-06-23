import { useState } from "react";
import { Routes, Route } from "react-router";
import AllArticles from "./AllArticles";
function MainSection({ queries }) {
  const [isError, setError] = useState(false);
  return (
    <main>
      <h2>Welcome!</h2>
      <Routes>
        <Route path="/" element={<AllArticles />} queries={queries} />
      </Routes>
    </main>
  );
}

export default MainSection;

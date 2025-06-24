import { useState } from "react";
import { Routes, Route } from "react-router";
import AllArticles from "./AllArticles";
import SingleArticle from "./SingleArticle";
import UserProfile from "./UserProfile";
import CreateArticle from "./CreateArticle";

function MainSection({ queries, username }) {
  return (
    <main>
      <Routes>
        <Route path="/" element={<AllArticles />} queries={queries} />
        <Route path="/articles" element={<AllArticles />} queries={queries} />
        <Route path="/articles/create" element={<CreateArticle />} />
        <Route
          path="/articles/:articleid"
          element={<SingleArticle />}
          queries={queries}
          username={username}
        />
        <Route path="/users/:username" element={<UserProfile />} />
      </Routes>
    </main>
  );
}

export default MainSection;

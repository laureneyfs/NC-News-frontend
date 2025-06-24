import { useState } from "react";
import { Routes, Route } from "react-router";
import AllArticles from "./AllArticles";
import SingleArticle from "./SingleArticle";
import UserProfile from "./UserProfile";
import CreateArticle from "./CreateArticle";
import Topic from "./Topic";

function MainSection({ queries, username }) {
  console.log(username, "main section");
  return (
    <main>
      <Routes>
        <Route path="/" element={<AllArticles />} queries={queries} />
        <Route path="/articles" element={<AllArticles />} queries={queries} />
        <Route path="/articles/create" element={<CreateArticle />} />
        <Route
          path="/articles/:articleid"
          element={<SingleArticle username={username} />}
        />
        <Route path="/topics/:topic" element={<Topic />} />
        <Route path="/users/:username" element={<UserProfile />} />
      </Routes>
    </main>
  );
}

export default MainSection;

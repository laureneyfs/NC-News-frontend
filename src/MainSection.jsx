import { Routes, Route } from "react-router";
import AllArticles from "./AllArticles";
import SingleArticle from "./SingleArticle";
import UserProfile from "./UserProfile";
import CreateArticle from "./CreateArticle";
import Topics from "./Topics";
import Login from "./Login";

function MainSection({ queries }) {
  return (
    <main>
      <Routes>
        <Route path="/" element={<AllArticles />} queries={queries} />
        <Route path="/articles" element={<AllArticles />} queries={queries} />
        <Route path="/articles/create" element={<CreateArticle />} />
        <Route path="/articles/:articleid" element={<SingleArticle />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/users/:username" element={<UserProfile />} />
        <Route path="/topics/:topic" element={<AllArticles />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </main>
  );
}

export default MainSection;

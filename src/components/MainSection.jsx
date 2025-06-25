import { Routes, Route } from "react-router";
import AllArticles from "../routes/AllArticles";
import SingleArticle from "../routes/SingleArticle";
import UserProfile from "../routes/UserProfile";
import CreateArticle from "../routes/CreateArticle";
import Topics from "../routes/Topics";
import Login from "../routes/Login";
import InvalidPage from "../routes/invalidPage";

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
        <Route path="*" element={<InvalidPage />} />
      </Routes>
    </main>
  );
}

export default MainSection;

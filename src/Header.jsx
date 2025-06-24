import { Link } from "react-router";

function Header({ username }) {
  return (
    <section className="top-bar">
      <header>
        <Link to="/">
          <h1>NC News</h1>
        </Link>
        <p>
          logged in as: <Link to={`/users/${username}`}>{username}</Link>
        </p>
        <Link to="/articles/create">
          <p>Create Article</p>
        </Link>
      </header>
    </section>
  );
}

export default Header;

import { Link } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

function Header() {
  const { loggedInUser } = useContext(UserContext);

  return (
    <section className="top-bar">
      <header>
        <Link className="logo-link" to="/">
          <h1 id="logo">NC News</h1>
        </Link>
        {loggedInUser ? (
          <p>
            logged in as:{" "}
            <Link className="nav-link" to={`/users/${loggedInUser.username}`}>
              {loggedInUser.username}
            </Link>
          </p>
        ) : (
          <Link className="nav-link" to={`/login`}>
            <p>Log in</p>
          </Link>
        )}

        <Link className="nav-link" to="/articles/create">
          <p>Create Article</p>
        </Link>
        <Link className="nav-link" to="/topics">
          <p>Topics</p>
        </Link>
      </header>
    </section>
  );
}

export default Header;

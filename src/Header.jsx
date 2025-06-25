import { Link } from "react-router";
import { UserContext } from "./contexts/UserContext";
import { useContext } from "react";

function Header({ username }) {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  return (
    <section className="top-bar">
      <header>
        <Link className="logo-link" to="/">
          <h1 id="logo">NC News</h1>
        </Link>
        {loggedInUser ? (
          <p>
            logged in as:{" "}
            <Link to={`/users/${loggedInUser.username}`}>
              {loggedInUser.username}
            </Link>
          </p>
        ) : (
          <Link to={`/login`}>
            <p>log in</p>
          </Link>
        )}

        <Link to="/articles/create">
          <p>Create Article</p>
        </Link>
        <Link to="/topics">
          <p>Topics</p>
        </Link>
      </header>
    </section>
  );
}

export default Header;

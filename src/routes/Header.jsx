import { Link } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

function Header() {
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  return (
    <section className="top-bar">
      <header>
        <Link className="logo-link" to="/">
          <h1 id="logo">NC News</h1>
        </Link>
        {loggedInUser ? (
          <>
            <Link
              className="nav-link nav-user"
              to={`/users/${loggedInUser.username}`}
            >
              <p>{loggedInUser.username}</p>
            </Link>
            <Link className="nav-link" to="/articles/create">
              <p>Create Article</p>
            </Link>
          </>
        ) : (
          <Link className="nav-link" to={`/login`}>
            <p>Log in</p>
          </Link>
        )}
        <Link className="nav-link" to="/topics">
          <p>Topics</p>
        </Link>
        {loggedInUser && (
          <Link
            className="nav-link logout-link"
            onClick={() => setLoggedInUser(null)}
          >
            <p>Log Out</p>
          </Link>
        )}
      </header>
    </section>
  );
}

export default Header;

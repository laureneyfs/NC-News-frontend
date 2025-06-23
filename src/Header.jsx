import { Link } from "react-router";

function Header({ username }) {
  console.log(username);
  return (
    <section className="top-bar">
      <header>
        <Link to="/">
          <h1>NC News</h1>
        </Link>
        <p>logged in as: {username}</p>
      </header>
    </section>
  );
}

export default Header;

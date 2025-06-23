function Header({ username }) {
  console.log(username);
  return (
    <section className="top-bar">
      <header>
        <h1>NC News</h1>
        <p>logged in as: {username}</p>
      </header>
    </section>
  );
}

export default Header;

import { useState, useContext, useEffect } from "react";
import { UserContext } from "./contexts/UserContext";
import { useNavigate } from "react-router";

function Login() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchAllUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await fetch(`https://nc-news-3uk2.onrender.com/api/users/`);
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      console.log(data.users[0]);
      setUsers(data.users.slice(0, 3));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  };
  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleLogin = (user) => {
    setLoggedInUser(user);
    navigate(`/`);
  };
  return (
    <>
      <h2>Choose user to log in as</h2>
      <section className="user-wrapper">
        {loadingUsers && (
          <section className="user-profile">
            <p>Loading users...</p>
          </section>
        )}
        {loggedInUser && (
          <section className="user-profile">
            <p>Already logged in as: {loggedInUser.username}</p>
          </section>
        )}
        {!loadingUsers &&
          !loggedInUser &&
          users.map((user) => (
            <section key={user.username} className="user-profile">
              <img
                className="user-avatar"
                src={user.avatar_url}
                alt={user.username}
              />
              <h3>{user.username}</h3>
              <button onClick={() => handleLogin(user)}>Log in</button>
            </section>
          ))}
      </section>
    </>
  );
}

export default Login;

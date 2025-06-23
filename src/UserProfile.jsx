import { useParams } from "react-router";
import { useEffect, useState } from "react";

function UserProfile() {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        const userResponse = await fetch(
          `https://nc-news-3uk2.onrender.com/api/users/${username}`
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user");
        }
        const data = await userResponse.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [username]);

  if (error) {
    return (
      <section className="article">
        <p>Error: {error}</p>
      </section>
    );
  }
  if (isLoading) {
    return (
      <section className="article">
        <p>Loading user profile...</p>
      </section>
    );
  }
  if (!user) {
    return (
      <section className="article">
        <p>No user found.</p>
      </section>
    );
  }
  console.log(user);
  return (
    <>
      <section className="user-profile">
        <section className="profile-image">
          <img src={user.avatar_url} />
        </section>
        <section className="profile-bio">
          <h2>{user.username}</h2>
          <p>Name: {user.name}</p>
        </section>
      </section>
    </>
  );
}

export default UserProfile;

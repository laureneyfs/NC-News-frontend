import { useNavigate } from "react-router";

function InvalidPage() {
  const navigate = useNavigate();
  return (
    <section className="error-block">
      <h2>Invalid Page!</h2>
      <button onClick={() => navigate(`/`)}>Back to Home</button>
    </section>
  );
}

export default InvalidPage;

import { useNavigate } from "react-router";
import { Error } from "../components/Error";

function InvalidPage() {
  const navigate = useNavigate();
  return (
    <Error message="invalid page">
      <button onClick={() => navigate(`/`)}>Back to Home</button>
    </Error>
  );
}

export default InvalidPage;

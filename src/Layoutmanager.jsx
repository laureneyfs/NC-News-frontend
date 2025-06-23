import Header from "./Header";
import MainSection from "./MainSection";
import { useState } from "react";

function LayoutManager() {
  const [queries, setQueries] = useState({});
  const [username, setUsername] = useState("guest");

  return (
    <>
      <Header username={username} />
      <main>
        <MainSection queries={queries} username={username} />
      </main>
    </>
  );
}

export default LayoutManager;

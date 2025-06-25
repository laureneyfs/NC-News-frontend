import Header from "./Header";
import MainSection from "./MainSection";
import { useState } from "react";

function LayoutManager() {
  const [queries, setQueries] = useState({});

  return (
    <>
      <Header />
      <main>
        <MainSection queries={queries} />
      </main>
    </>
  );
}

export default LayoutManager;

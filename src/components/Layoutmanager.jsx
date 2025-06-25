import Header from "../routes/Header";
import MainSection from "./MainSection";
import { useState } from "react";
import Footer from "./Footer";

function LayoutManager() {
  const [queries, setQueries] = useState({});

  return (
    <>
      <Header />
      <main>
        <MainSection queries={queries} />
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default LayoutManager;

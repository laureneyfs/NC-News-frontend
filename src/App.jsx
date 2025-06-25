import LayoutManager from "./components/Layoutmanager";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <LayoutManager />
    </UserProvider>
  );
}

export default App;

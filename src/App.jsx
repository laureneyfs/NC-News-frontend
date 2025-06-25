import LayoutManager from "./Layoutmanager";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <LayoutManager />
    </UserProvider>
  );
}

export default App;

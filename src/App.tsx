import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import GridPage from "./pages/GridPage";
import GridWithFilter from "./pages/GridWithFilter";
import ListPage from "./pages/ListPage";
import GridDetailPage from "./pages/GridDetailPage"; // <-- add this

function App() {
  return (
    <Router>
      <nav style={{ padding: "1rem", background: "#f0f0f0", display: "flex", gap: "1rem" }}>
        <Link to="/grid">Grid View</Link>
        <Link to="/grid-filter">Grid with Filter</Link>
        <Link to="/list">List View</Link>
      </nav>

      <Routes>
        <Route path="/grid" element={<GridPage />} />
        <Route path="/grid-filter" element={<GridWithFilter />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/launch/:id" element={<GridDetailPage />} /> {/* <-- detail page route */}
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import GridPage from "./pages/GridPage";
import GridWithFilter from "./pages/GridWithFilter";
import ListPage from "./pages/ListPage";
import GridDetailPage from "./pages/GridDetailPage";
import type { Launch } from "./types";
import GridCard from "./components/GridCard"; // reuse your existing card

function App() {
  const [launches, setLaunches] = useState<Launch[]>([]);

  useEffect(() => {
    fetch("https://api.spacexdata.com/v4/launches")
      .then((res) => res.json())
      .then((data) => setLaunches(data.slice(0, 6))); // latest 6 launches
  }, []);

  // Home page content
  const Home = () => (
    <div>
      {/* Hero Section */}
      <section style={{ padding: "2rem", textAlign: "center", background: "#f0f0f0" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>Mission Inventory Dashboard</h1>
        <p style={{ fontSize: "1.2rem", color: "#555" }}>
          Track space missions, rockets, and payloads in real time
        </p>
      </section>

      {/* Recent Missions Grid */}
      <section style={{ padding: "2rem" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Latest Launches</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
          {launches.map((launch) => (
            <GridCard key={launch.id} launch={launch} />
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section style={{ padding: "2rem", background: "#fafafa" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "1rem" }}>Explore Missions</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link to="/grid" style={{ padding: "0.5rem 1rem", background: "#0070f3", color: "#fff", borderRadius: "5px" }}>Grid View</Link>
          <Link to="/grid-filter" style={{ padding: "0.5rem 1rem", background: "#0070f3", color: "#fff", borderRadius: "5px" }}>Grid With Filter</Link>
          <Link to="/list" style={{ padding: "0.5rem 1rem", background: "#0070f3", color: "#fff", borderRadius: "5px" }}>List View</Link>
        </div>
      </section>
    </div>
  );

  return (
    <Router>
      <nav style={{ padding: "1rem", background: "#f0f0f0", display: "flex", gap: "1rem" }}>
        <Link to="/">Home</Link>
        <Link to="/grid">Grid View</Link>
        <Link to="/grid-filter">Grid with Filter</Link>
        <Link to="/list">List View</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/grid" element={<GridPage />} />
        <Route path="/grid-filter" element={<GridWithFilter />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/launch/:id" element={<GridDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;

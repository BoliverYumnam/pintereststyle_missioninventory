import React, { useEffect, useState } from "react";
import axios from "axios";
import ListItem from "../components/ListItem";
import type { Launch } from "../types";

interface Rocket {
  id: string;
  name: string;
}

interface Launchpad {
  id: string;
  name: string;
}

interface Payload {
  id: string;
  type: string;
  customers: string[];
}

const ListPage: React.FC = () => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [filtered, setFiltered] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [successFilter, setSuccessFilter] = useState<"all" | "success" | "failure">("all");
  const [rocketFilter, setRocketFilter] = useState<string>("all");
  const [launchpadFilter, setLaunchpadFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<"name-asc" | "name-desc" | "date-new" | "date-old">("date-new");

  // Metadata
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const [launchpads, setLaunchpads] = useState<Launchpad[]>([]);
  const [payloads, setPayloads] = useState<Payload[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch launches
        const launchRes = await axios.get<Launch[]>("https://api.spacexdata.com/v4/launches");
        setLaunches(launchRes.data);
        setFiltered(launchRes.data);

        // Fetch rockets
        const rocketRes = await axios.get<Rocket[]>("https://api.spacexdata.com/v4/rockets");
        setRockets(rocketRes.data);

        // Fetch launchpads
        const launchpadRes = await axios.get<Launchpad[]>("https://api.spacexdata.com/v4/launchpads");
        setLaunchpads(launchpadRes.data);

        // Fetch payloads
        const payloadRes = await axios.get<Payload[]>("https://api.spacexdata.com/v4/payloads");
        setPayloads(payloadRes.data);

      } catch {
        setError("Failed to fetch data. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let temp = [...launches];

    // Filter by searchTerm across multiple fields
    if (searchTerm.trim() !== "") {
      temp = temp.filter((l) => {
        const rocketName = rockets.find(r => r.id === l.rocket)?.name ?? "";
        const launchpadName = launchpads.find(p => p.id === l.launchpad)?.name ?? "";

        // Payload types and customers
        const launchPayloads = payloads.filter(p => l.payloads.includes(p.id));
        const payloadTypes = launchPayloads.map(p => p.type.toLowerCase()).join(" ");
        const payloadCustomers = launchPayloads.flatMap(p => p.customers.map(c => c.toLowerCase())).join(" ");

        return (
          l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (l.details?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
          rocketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          launchpadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payloadTypes.includes(searchTerm.toLowerCase()) ||
          payloadCustomers.includes(searchTerm.toLowerCase())
        );
      });
    }

    // Success/Failure filter
    if (successFilter === "success") temp = temp.filter((l) => l.success === true);
    if (successFilter === "failure") temp = temp.filter((l) => l.success === false);

    // Rocket filter
    if (rocketFilter !== "all") temp = temp.filter((l) => l.rocket === rocketFilter);

    // Launchpad filter
    if (launchpadFilter !== "all") temp = temp.filter((l) => l.launchpad === launchpadFilter);

    // Sorting
    switch (sortOption) {
      case "name-asc":
        temp.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        temp.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "date-new":
        temp.sort((a, b) => new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime());
        break;
      case "date-old":
        temp.sort((a, b) => new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime());
        break;
    }

    setFiltered(temp);
  }, [searchTerm, successFilter, rocketFilter, launchpadFilter, sortOption, launches, rockets, launchpads, payloads]);

  const handleReset = () => {
    setSearchTerm("");
    setSuccessFilter("all");
    setRocketFilter("all");
    setLaunchpadFilter("all");
    setSortOption("date-new");
  };

  if (loading) return <p>Loading launches...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>List View - SpaceX Launches</h2>

      {/* Filter Bar */}
      <div
  style={{
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    padding: "0.5rem 0.5rem 0.5rem 0.5rem",
    marginBottom: "1rem",
    alignItems: "center",
    position: "sticky",       // Make it sticky
    top: 0,                   // Stick to top
    background: "#ffffff",    // White background so it doesn't overlap content
    zIndex: 1000,             // Keep it above list items
    borderBottom: "1px solid #ccc" // Optional: subtle separation
  }}
>
        <input
          type="text"
          placeholder="Search launches by name, rocket, launchpad, payload, customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", flexGrow: 1, minWidth: "200px" }}
        />

        <select value={successFilter} onChange={(e) => setSuccessFilter(e.target.value as any)} style={{ padding: "0.5rem" }}>
          <option value="all">All</option>
          <option value="success">Success ✅</option>
          <option value="failure">Failure ❌</option>
        </select>

        <select value={rocketFilter} onChange={(e) => setRocketFilter(e.target.value)} style={{ padding: "0.5rem" }}>
          <option value="all">All Rockets</option>
          {rockets.map((r) => (<option key={r.id} value={r.id}>{r.name}</option>))}
        </select>

        <select value={launchpadFilter} onChange={(e) => setLaunchpadFilter(e.target.value)} style={{ padding: "0.5rem" }}>
          <option value="all">All Launchpads</option>
          {launchpads.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
        </select>

        <select value={sortOption} onChange={(e) => setSortOption(e.target.value as any)} style={{ padding: "0.5rem" }}>
          <option value="date-new">Date: Newest → Oldest</option>
          <option value="date-old">Date: Oldest → Newest</option>
          <option value="name-asc">Name: A → Z</option>
          <option value="name-desc">Name: Z → A</option>
        </select>

        <button onClick={handleReset} style={{ padding: "0.5rem", background: "#eee", borderRadius: "4px" }}>
          Reset
        </button>
      </div>

      {/* Filter Summary */}
      <p style={{ marginBottom: "0.5rem" }}>
        Showing {filtered.length} of {launches.length} launches
      </p>

      {/* List Items */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filtered.map((launch) => (
          <ListItem key={launch.id} launch={launch} />
        ))}
      </ul>
    </div>
  );
};

export default ListPage;

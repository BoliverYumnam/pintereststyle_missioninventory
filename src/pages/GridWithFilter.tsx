import React, { useEffect, useState } from "react";
import axios from "axios";
import GridCard from "../components/GridCard";
import type { Launch } from "../types";
import Masonry from "react-masonry-css";

const GridWithFilter: React.FC = () => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [filtered, setFiltered] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterStatus, setFilterStatus] = useState("all"); // all, success, failure, pending
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch SpaceX launches
  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const res = await axios.get<Launch[]>(
          "https://api.spacexdata.com/v4/launches"
        );
        setLaunches(res.data);
        setFiltered(res.data);
      } catch {
        setError("Failed to fetch data. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);

  // Apply filters
  useEffect(() => {
    let temp = [...launches];

    // Status filter
    if (filterStatus !== "all") {
      temp = temp.filter((l) =>
        filterStatus === "success"
          ? l.success === true
          : filterStatus === "failure"
          ? l.success === false
          : l.success === null
      );
    }

    // Search filter
    if (searchTerm.trim() !== "") {
      temp = temp.filter((l) =>
        l.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltered(temp);
  }, [filterStatus, searchTerm, launches]);

  if (loading) return <p>Loading grid data...</p>;
  if (error) return <p>{error}</p>;

  // Masonry breakpoints
  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    900: 2,
    500: 1,
  };

  return (
    <div style={{ padding: "1rem" }}>
      {/* Sticky Header + Filter Bar */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: "#fff",
          padding: "1rem",
          borderBottom: "1px solid #ddd",
          boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        }}
      >
        {/* Page Title */}
        <h2 style={{ margin: 0, marginBottom: "0.5rem" }}>
          Grid View with Filters
        </h2>

        {/* Filter Bar */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="all">All</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
            <option value="pending">Pending</option>
          </select>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              flex: 1,
              minWidth: "200px",
            }}
          />
        </div>
      </div>

      {/* Masonry Grid */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {filtered.map((launch) => (
          <GridCard key={launch.id} launch={launch} />
        ))}
      </Masonry>
    </div>
  );
};

export default GridWithFilter;

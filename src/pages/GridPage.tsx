import React, { useEffect, useState } from "react";
import axios from "axios";
import GridCard from "../components/GridCard";
import type { Launch } from "../types";
import Masonry from "react-masonry-css";

const GridPage: React.FC = () => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLaunches = async () => {
      try {
        const res = await axios.get<Launch[]>(
          "https://api.spacexdata.com/v4/launches"
        );
        setLaunches(res.data);
      } catch {
        setError("Failed to fetch data. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, []);

  if (loading) return <p>Loading grid data...</p>;
  if (error) return <p>{error}</p>;

  // Define breakpoints for responsive masonry
  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    900: 2,
    500: 1,
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Grid View - SpaceX Launches</h2>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {launches.map((launch) => (
          <GridCard key={launch.id} launch={launch} />
        ))}
      </Masonry>
    </div>
  );
};

export default GridPage;

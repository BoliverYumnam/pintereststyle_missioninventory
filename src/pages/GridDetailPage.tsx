import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import type { Launch } from "../types";

const GridDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLaunch = async () => {
      try {
        const res = await axios.get<Launch>(
          `https://api.spacexdata.com/v4/launches/${id}`
        );
        setLaunch(res.data);
      } catch {
        setError("Failed to fetch launch details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLaunch();
  }, [id]);

  if (loading) return <p>Loading launch details...</p>;
  if (error) return <p>{error}</p>;
  if (!launch) return <p>No launch found.</p>;

  const formattedDate = launch.date_utc
    ? new Date(launch.date_utc).toLocaleString()
    : "Unknown";

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      {/* Back Link */}
      <Link
        to="/"
        style={{
          marginBottom: "1rem",
          display: "inline-block",
          color: "#1da1f2",
          textDecoration: "none",
        }}
      >
        ← Back to Grid
      </Link>

      {/* Launch Title */}
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        {launch.name || "Unknown Launch"}
      </h1>

      {/* Status */}
      <p
        style={{
          color:
            launch.success === true
              ? "green"
              : launch.success === false
              ? "red"
              : "gray",
          fontWeight: 600,
        }}
      >
        {launch.success === true
          ? "Success"
          : launch.success === false
          ? "Failure"
          : "Pending"}
      </p>

      {/* Date */}
      <p style={{ marginTop: "0.25rem", fontSize: "0.9rem", color: "#555" }}>
        Date: {formattedDate}
      </p>

      {/* Rocket / Mission Info */}
      {launch.details && (
        <p style={{ marginTop: "1rem", lineHeight: "1.4rem", fontSize: "1rem" }}>
          {launch.details}
        </p>
      )}

      {/* Images */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
        {launch.links?.patch?.small && (
          <img
            src={launch.links.patch.small}
            alt={launch.name || "Launch Patch"}
            style={{ width: "150px", borderRadius: "8px" }}
          />
        )}
        {launch.links?.patch?.large && (
          <img
            src={launch.links.patch.large}
            alt={launch.name || "Launch Patch Large"}
            style={{ width: "150px", borderRadius: "8px" }}
          />
        )}
        {launch.links?.flickr?.original &&
          launch.links.flickr.original.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${launch.name} image ${index + 1}`}
              style={{ width: "200px", borderRadius: "8px" }}
            />
          ))}
      </div>

      {/* Links */}
      <div style={{ marginTop: "1rem" }}>
        {launch.links?.webcast && (
          <p>
            <a
              href={launch.links.webcast}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1da1f2" }}
            >
              Watch Webcast
            </a>
          </p>
        )}
        {launch.links?.wikipedia && (
          <p>
            <a
              href={launch.links.wikipedia}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1da1f2" }}
            >
              Wikipedia
            </a>
          </p>
        )}
        {launch.links?.article && (
          <p>
            <a
              href={launch.links.article}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1da1f2" }}
            >
              Read Article
            </a>
          </p>
        )}
      </div>

      {/* Additional Metadata */}
      <div style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#555" }}>
        <p><strong>Flight Number:</strong> {launch.flight_number}</p>
        <p><strong>Upcoming:</strong> {launch.upcoming ? "Yes" : "No"}</p>
        <p><strong>Capsule Reused:</strong> {launch.cores?.some(core => core.reused) ? "Yes" : "No"}</p>
        {launch.rocket && <p><strong>Rocket ID:</strong> {launch.rocket}</p>}
        {launch.launchpad && <p><strong>Launchpad ID:</strong> {launch.launchpad}</p>}
      </div>
    </div>
  );
};

export default GridDetailPage;

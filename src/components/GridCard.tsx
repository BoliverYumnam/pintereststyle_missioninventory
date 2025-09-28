import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- added
import type { Launch } from "../types";

interface Props {
  launch: Launch;
}

const GridCard: React.FC<Props> = ({ launch }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate(); // <-- added

  const formattedDate = launch.date_utc
    ? new Date(launch.date_utc).toLocaleString()
    : "Unknown";

  const handleClick = () => {
    navigate(`/launch/${launch.id}`); // <-- navigate on click
  };

  return (
    <div
      onClick={handleClick} // <-- added
      style={{
        border: "1px solid #e1e4e8",
        borderRadius: "8px",
        padding: "1rem",
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer", // <-- indicates clickable
      }}
    >
      {/* Image */}
      {launch.links?.patch?.small && (
        <img
          src={launch.links.patch.small}
          alt={launch.name || "Launch Image"}
          style={{
            width: "100%",
            objectFit: "contain",
            borderRadius: "8px",
            marginBottom: "0.5rem",
          }}
        />
      )}

      {/* Launch Name */}
      <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
        {launch.name || "Unknown Launch"}
      </h3>

      {/* Status */}
      <span
        style={{
          color:
            launch.success === true
              ? "green"
              : launch.success === false
              ? "red"
              : "gray",
          fontWeight: 600,
          fontSize: "0.85rem",
          marginTop: "0.25rem",
        }}
      >
        {launch.success === true
          ? "Success"
          : launch.success === false
          ? "Failure"
          : "Pending"}
      </span>

      {/* Date */}
      <p style={{ marginTop: "0.25rem", fontSize: "0.85rem", color: "#555" }}>
        Date: {formattedDate}
      </p>

      {/* Description */}
      {launch.details && (
        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "0.9rem",
            lineHeight: "1.3rem",
            color: "#333",
          }}
        >
          {expanded
            ? launch.details
            : `${launch.details.slice(0, 120)}${
                launch.details.length > 120 ? "..." : ""
              }`}
          {launch.details.length > 120 && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent navigation when clicking see more/less
                setExpanded(!expanded);
              }}
              style={{
                marginLeft: "0.5rem",
                color: "#1da1f2",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {expanded ? "See Less" : "See More"}
            </button>
          )}
        </p>
      )}

      {/* Webcast */}
      {launch.links?.webcast && (
        <a
          href={launch.links.webcast}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.85rem", color: "#1da1f2", marginTop: "0.5rem" }}
        >
          Watch Webcast
        </a>
      )}
    </div>
  );
};

export default GridCard;

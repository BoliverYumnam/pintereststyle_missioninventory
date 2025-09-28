import React, { useState } from "react";
import type { Launch } from "../types";

interface Props {
  launch: Launch;
}

const ListItem: React.FC<Props> = ({ launch }) => {
  const [expanded, setExpanded] = useState(false);
  const formattedDate = new Date(launch.date_utc).toLocaleString();

  return (
    <li
      style={{
        border: "1px solid #e1e4e8",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "0.75rem",
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        display: "flex",
        gap: "1rem",
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      {/* Image */}
      {launch.links?.patch?.small && (
        <img
          src={launch.links.patch.small}
          alt={launch.name}
          style={{
            width: "80px",
            height: "80px",
            objectFit: "contain",
            borderRadius: "8px",
            flexShrink: 0,
          }}
        />
      )}

      {/* Info Section */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header: Launch Name & Status */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
            {launch.name}
          </h3>
          <span
            style={{
              color: launch.success === true ? "green" : launch.success === false ? "red" : "gray",
              fontWeight: 600,
            }}
          >
            {launch.success === true ? "Success" : launch.success === false ? "Failure" : "Pending"}
          </span>
        </div>

        {/* Subheader: Date / Rocket / Launchpad */}
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.875rem", color: "#555", marginTop: "0.5rem", flexWrap: "wrap" }}>
          <span>Date: {formattedDate}</span>
          <span>Rocket ID: {launch.rocket}</span>
          <span>Launchpad ID: {launch.launchpad}</span>
        </div>

        {/* Description */}
        {launch.details && (
          <p style={{ marginTop: "0.75rem", fontSize: "0.9rem", lineHeight: "1.3rem", color: "#333" }}>
            {expanded ? launch.details : `${launch.details.slice(0, 170)}${launch.details.length > 170 ? "..." : ""}`}
            {launch.details.length > 170 && (
              <button
                onClick={() => setExpanded(!expanded)}
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

        {/* Optional Webcast Link */}
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
    </li>
  );
};

export default ListItem;

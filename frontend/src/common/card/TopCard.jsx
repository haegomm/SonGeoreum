import * as React from "react";
import "./TopCard.scss";

export default function TopCard({ text, color }) {
  const selectedColor = color === "green" ? "#90de8a" : color;

  return (
    <div className="topCard" style={{ color: selectedColor }}>
      {text}
    </div>
  );
}

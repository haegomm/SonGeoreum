import * as React from "react";
import "./TopCard.scss";

export default function TopCard({ text, color }) {
  return (
    <div className="topCard" style={(color = { color })}>
      {text}
    </div>
  );
}

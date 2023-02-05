import * as React from "react";
import "./WordSmall.scss";
import StarIcon from "@mui/icons-material/Star";

export default function WordSmall({ text, star, isLogin }) {
  const isStar = star ? (
    <StarIcon color="yellow" sx={{ fontSize: 28 }} />
  ) : (
    <StarIcon color="disabled" sx={{ fontSize: 28 }} />
  );

  return (
    <div className="smallWordBox">
      {isLogin ? <div className="smallStarBox">{isStar}</div> : null}
      <div className="text">{text}</div>
    </div>
  );
}

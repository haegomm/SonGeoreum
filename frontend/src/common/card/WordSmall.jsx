import * as React from "react";
import "./WordSmall.scss";
import StarIcon from "@mui/icons-material/Star";

export default function WordSmall({
  text,
  star,
  isLogin,
  index,
  handleListItemClick,
  listMode,
}) {
  const isStar = star ? (
    <StarIcon color="yellow" sx={{ fontSize: 28 }} />
  ) : null;

  const onClick = () => {
    console.log(index);
    handleListItemClick(index);
    listMode(listMode);
  };

  return (
    <div className="smallWordBox" onClick={onClick}>
      {isLogin ? <div className="smallStarBox">{isStar}</div> : null}
      <div className="text">{text}</div>
    </div>
  );
}

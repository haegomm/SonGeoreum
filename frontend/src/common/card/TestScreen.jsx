import * as React from "react";

import "./TestScreen.scss";

export default function TestScreen({ link, categoryNum }) {
  const media =
    categoryNum > 3 ? (
      <video src={link} autoPlay poster="" loop></video>
    ) : (
      <img className="handImage" src={link} referrerPolicy="no-referrer" />
    );

  return (
    <div className="testScreen">
      <div className="videoBox">{media}</div>
    </div>
  );
}

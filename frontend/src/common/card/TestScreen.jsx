import * as React from "react";

import "./TestScreen.scss";

export default function TestScreen({ link, categoryNum }) {
  const media =
    categoryNum > 3 ? (
      <video
        src={link}
        autoPlay
        poster=""
        //   control
        loop
      ></video>
    ) : (
      <img
        className="handImage"
        src={link}
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );

  return (
    <div className="testScreen">
      <div className="videoBox">{media}</div>
    </div>
  );
}

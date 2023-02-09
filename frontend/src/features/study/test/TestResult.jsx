import * as React from "react";

import "./TestResult.scss";

export default function TestResult({ link, categoryNum }) {
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
      <img className="handImage" src={link} referrerPolicy="no-referrer" />
    );

  return (
    <div className="testScreen">
      <div className="videoBox">{media}</div>
    </div>
  );
}
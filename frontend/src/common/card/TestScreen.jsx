import * as React from "react";

import "./TestScreen.scss";
import StarIcon from "@mui/icons-material/Star";

export default function TestScreen({ link, isLogin }) {
  const [star, setStar] = React.useState(false); // 즐겨찾기 유무

  const starChange = (event) => {
    setStar(!star);
    // 이곳에 즐겨찾기 하기, 해제하기 코드가 들어갑니다.
  };

  const isStar = star ? (
    <StarIcon color="yellow" sx={{ fontSize: 45 }} onClick={starChange} />
  ) : (
    <StarIcon color="disabled" sx={{ fontSize: 45 }} onClick={starChange} />
  );

  return (
    <div className="testScreen">
      {isLogin ? <div className="starBox">{isStar}</div> : null}
      <div className="videoBox">
        <video
          src={link}
          autoPlay
          poster=""
          //   control
          loop
        ></video>
      </div>
    </div>
  );
}

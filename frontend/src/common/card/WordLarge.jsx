import * as React from "react";
import LargeButton from "../button/LargeButton";

import "./WordLarge.scss";
import "./flip.scss";

import StarIcon from "@mui/icons-material/Star";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import ArrowDropUpRoundedIcon from "@mui/icons-material/ArrowDropUpRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

export default function WordLarge({ isLogin, link }) {
  const [star, setStar] = React.useState(false); // 즐겨찾기 유무
  const [wordNumber, setWordNumber] = React.useState(0); // 현재 단어 번호

  const handleListItemClick = (event, index) => {
    console.log(index);
    setWordNumber(index);
    console.log(wordNumber);
  };

  const numberPlus = () => {
    const num = wordNumber;
    setWordNumber(num + 1);
    console.log(wordNumber);
  };

  const numberMinus = () => {
    const num = wordNumber;
    setWordNumber(num - 1);
    console.log(wordNumber);
  };

  const words = [
    { no: 0, voca: "학습하기0", video: "/study" },
    { no: 1, voca: "학습하기1", video: "/study" },
    { no: 2, voca: "게임하기2", video: "/game" },
    { no: 3, voca: "알아보기3", video: "/culture" },
    { no: 4, voca: "학습하기4", video: "/study" },
    { no: 5, voca: "게임하기5", video: "/game" },
    { no: 6, voca: "알아보기6", video: "/culture" },
    { no: 7, voca: "학습하기7", video: "/study" },
    { no: 8, voca: "게임하기8", video: "/game" },
    { no: 9, voca: "알아보기9", video: "/culture" },
    { no: 10, voca: "학습하기", video: "/study" },
    { no: 11, voca: "게임하기", video: "/game" },
    { no: 12, voca: "알아보기", video: "/culture" },
    { no: 13, voca: "학습하기", video: "/study" },
    { no: 14, voca: "게임하기", video: "/game" },
    { no: 15, voca: "알아보기", video: "/culture" },
  ];

  const up =
    wordNumber === 0 ? (
      <ArrowDropUpRoundedIcon
        color="disabled"
        sx={{ fontSize: 40 }}
        onClick={undefined}
      />
    ) : (
      <div className="top" href={"#section" + wordNumber} onClick={numberMinus}>
        <ArrowDropUpRoundedIcon color="blue" sx={{ fontSize: 40 }} />
      </div>
    );

  const down =
    wordNumber === words.length - 1 ? (
      <ArrowDropDownRoundedIcon
        color="disabled"
        sx={{ fontSize: 40 }}
        onClick={undefined}
      />
    ) : (
      <div
        className="bottom"
        href={"#section" + wordNumber}
        onClick={numberPlus}
      >
        <ArrowDropDownRoundedIcon color="blue" sx={{ fontSize: 40 }} />
      </div>
    );

  const previous =
    wordNumber === 0 ? (
      <div className="arrowBackBox">
        <ArrowBackIosRoundedIcon color="disabled" sx={{ fontSize: 45 }} />
      </div>
    ) : (
      <div
        className="arrowBackBox"
        href={"#section" + wordNumber}
        onClick={numberMinus}
      >
        <ArrowBackIosRoundedIcon color="blue" sx={{ fontSize: 45 }} />
      </div>
    );

  const next =
    wordNumber === words.length - 1 ? (
      <div className="arrowForwardBox">
        <ArrowForwardIosRoundedIcon color="disabled" sx={{ fontSize: 45 }} />
      </div>
    ) : (
      <div
        className="arrowForwardBox"
        href={"#section" + wordNumber}
        onClick={numberPlus}
      >
        <ArrowForwardIosRoundedIcon color="blue" sx={{ fontSize: 45 }} />
      </div>
    );

  const starChange = (event) => {
    setStar(!star);
    // 이곳에 즐겨찾기 하기, 해제하기 코드가 들어갑니다.
  };

  const isStar = star ? (
    <StarIcon color="yellow" sx={{ fontSize: 45 }} onClick={starChange} />
  ) : (
    <StarIcon color="disabled" sx={{ fontSize: 45 }} onClick={starChange} />
  );

  const flip = () => {
    document.getElementById("flip-container").className += " hover";
  };
  const flipAgain = () => {
    document.getElementById("flip-container").className = "flip-container";
  };

  return (
    <div className="container">
      <div className="bigWordCard">
        <div id="flip-container" className="flip-container">
          <div className="flipper">
            <div className="front">
              {isLogin ? <div className="starBox">{isStar}</div> : null}
              <div className="shuffleBox">
                <ShuffleRoundedIcon
                  color="blue"
                  sx={{ fontSize: 45 }}
                  onClick={undefined}
                />
              </div>
              <div className="menuBox">
                <MenuRoundedIcon
                  color="blue"
                  sx={{ fontSize: 45 }}
                  onClick={undefined}
                />
              </div>
              {previous}
              {next}
              <div onClick={flip}>
                <div className="word">{words[wordNumber].voca}</div>
              </div>
            </div>
            <div className="back" onClick={flipAgain}>
              {isLogin ? <div className="starBox">{isStar}</div> : null}
              <div className="wordVideoBox">
                <video
                  src={link}
                  autoPlay
                  poster=""
                  //   control
                  loop
                ></video>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="wordList">
        <div className="wordListCard">
          <div className="arrowBox ">{up}</div>
          <div className="listBox scroll-container">
            <List
              sx={{ width: "100%", maxWidth: 360 }}
              style={{ color: "black", padding: 0 }}
              aria-label="contacts"
            >
              {words.map((word) => (
                <ListItem disablePadding id={"section" + word.no} key={word.no}>
                  <ListItemButton
                    selected={wordNumber === word.no}
                    onClick={(event) => handleListItemClick(event, word.no)}
                  >
                    <ListItemText
                      primary={word.voca}
                      primaryTypographyProps={{
                        fontSize: 20,
                        fontWeight: "medium",
                        letterSpacing: 0,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </div>
          <div className="arrowBox">{down}</div>
        </div>
        <LargeButton text="TEST" type="learnToTest" backgroundColor="blue" />
      </div>
    </div>
  );
}

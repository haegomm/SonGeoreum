import * as React from "react";
import LargeButton from "../../../common/button/LargeButton";
import { useState, useEffect } from "react";
import axios from "axios";

import WordSmall from "../../../common/card/WordSmall";
import "./WordLarge.scss";
import "../../../common/card/flip.scss";

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

export default function WordLarge({ isLogin, categoryNum }) {
  const [star, setStar] = useState(false); // 즐겨찾기 유무
  const [wordNumber, setWordNumber] = useState(); // 현재 단어 번호
  const [startNumber, setStartNumber] = useState(); // 현재 단어 번호
  const [endNumber, setEndNumber] = useState(); // 현재 단어 번호
  const [wordList, setWordList] = useState(); // 단어 목록
  const [blockListMode, setBlockListMode] = useState(false); // 작은 단어장 리스트

  useEffect(() => {
    async function getInfo() {
      const data = await axios.get(
        `https://i8b106.p.ssafy.io/api/words?categoryId=${categoryNum}`
      );
      setWordList(data.data);
      console.log(data.data);
      setWordNumber(0);
      setStartNumber(data.data[0].id);
      setEndNumber(data.data.length - 1);
    }
    getInfo();
  }, []);

  const handleListItemClick = (index) => {
    console.log("index 확인중..", index);
    setWordNumber(index - startNumber);
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
    wordNumber === endNumber ? (
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
    wordNumber === endNumber ? (
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

  const listMode = () => {
    setBlockListMode(!blockListMode);
  };

  if (wordList && wordList.length > 0) {
    console.log("나와라..", wordList);

    console.log("번호는?", wordNumber);
    console.log("이것도..", wordList[wordNumber].name);

    const media =
      categoryNum > 3 && wordList && wordList.length > 0 ? (
        <video
          src={wordList[wordNumber].contentUrl}
          autoPlay
          poster=""
          //   control
          loop
        ></video>
      ) : (
        <img
          className="handImage"
          src={wordList[wordNumber].contentUrl}
          referrerPolicy="no-referrer"
        />
      );
    if (blockListMode) {
      return (
        <div className="">
          {wordList.map((word) => (
            <WordSmall
              key={word.id}
              text={word.name}
              star={true}
              isLogin={isLogin}
              index={word.id}
              handleListItemClick={handleListItemClick}
              listMode={listMode}
            />
          ))}
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="bigWordCard">
            <div id="flip-container" className="flip-container">
              <div className="flipper">
                <div className="front">
                  <div className="starBox">{isStar}</div>
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
                      onClick={() => listMode()}
                    />
                  </div>
                  {previous}
                  {next}
                  <div onClick={flip}>
                    <div className="word">{wordList[wordNumber].name}</div>
                  </div>
                </div>
                <div className="back">
                  <div className="starBox">{isStar}</div>
                  {previous}
                  {next}
                  <div className="wordBackBox" onClick={flipAgain}>
                    <div className="wordVideoBox">{media}</div>
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
                  {wordList.map((word) => (
                    <ListItem
                      disablePadding
                      id={"section" + word.id}
                      key={"id" + word.id}
                    >
                      <ListItemButton
                        selected={wordNumber === word.id - startNumber}
                        onClick={(event) => handleListItemClick(word.id)}
                      >
                        <ListItemText
                          primary={word.name}
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
            <LargeButton
              text="TEST"
              type="learnToTest"
              backgroundColor="blue"
            />
          </div>
        </div>
      );
    }
  }
}

import { useState, useEffect } from "react";

import LargeButton from "../../../common/button/LargeButton";
import axios from "../../../common/api/https";
import WordSmall from "../../../common/card/WordSmall";

import "./WordLarge.scss";
import "../FadeIn.scss";
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
  const [wordNumber, setWordNumber] = useState(0); // 현재 단어 번호
  const [startNumber, setStartNumber] = useState(); // 현재 단어 번호
  const [endNumber, setEndNumber] = useState(); // 현재 단어 번호
  const [wordList, setWordList] = useState(); // 단어 목록
  const [blockListMode, setBlockListMode] = useState(false); // 작은 단어장 리스트

  useEffect(() => {
    async function getInfo() {
      const data = await axios.get(`/api/words?categoryId=${categoryNum}`);
      setWordList(data.data);
      console.log(data.data);
      setWordNumber(() => 0);
      setStartNumber(data.data[0].id);
      setEndNumber(data.data.length - 1);
    }
    getInfo();
    if (isLogin) {
      async function getStar() {
        const num = 0 + startNumber;
        const data = await axios.get(`/api/favorites/word/${num}`);
        console.log("즐겨찾기 확인해보자 >> ", data.data.message);
        const isStar = data.data.message;
        if (isStar === "success") setStar(() => true);
      }
      getStar();
    }
  }, []);

  const starInfo = (num) => {
    if (isLogin && wordList) {
      async function getStar() {
        const data = await axios.get(`/api/favorites/word/${num}`);
        console.log(`즐겨찾기 확인해보자 ${num} >> `, data.data.message);
        const isStar = data.data.message;
        if (isStar === "success") setStar(() => true);
        else setStar(() => false);
      }
      getStar();
    }
  };

  const handleListItemClick = (index) => {
    console.log("index 확인중..", index);
    setWordNumber(index);
    console.log(wordNumber);
  };

  const numberPlus = () => {
    const num = wordNumber;
    setWordNumber(num + 1);
    console.log(wordNumber);
    starInfo(num + startNumber);
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

  const starPost = (id) => {
    console.log("즐겨찾기 >> ", id);
    setStar(true);
    async function postStar() {
      const data = await axios.post(`/api/favorites`, {
        wordId: id,
      });
      console.log(data);
    }
    postStar();
  };

  const starDelete = (id) => {
    console.log("즐겨찾기 해제 >> ", id);
    setStar(true);
    async function deleteStar() {
      const data = await axios.delete(`/api/favorites`, {
        wordId: id,
      });
      console.log(data);
    }
    deleteStar();
  };

  const isStar = star ? (
    <StarIcon
      color="yellow"
      sx={{ fontSize: 45 }}
      onClick={() => starDelete(wordNumber + startNumber)}
    />
  ) : (
    <StarIcon
      color="disabled"
      sx={{ fontSize: 45 }}
      onClick={() => starPost(wordNumber + startNumber)}
    />
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

  const shuffle = () => {
    async function shuffleInfo() {
      const data = await axios.get(
        `https://i8b106.p.ssafy.io/api/words?categoryId=${categoryNum}&isRandom=true`
      );
      setWordList(data.data);
      console.log(data.data);
      setWordNumber(0);
      setStartNumber(data.data[0].id);
      setEndNumber(data.data.length - 1);
    }
    shuffleInfo();
  };

  if (wordList && wordList.length > 0) {
    console.log("나와라..", wordList);

    console.log("번호는?", wordNumber);
    console.log("이것도..", wordList[wordNumber].name);
    console.log("별이 켜졌나..", star);

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
        <div>
          <div className="fade-up">
            {wordList.map((word, index) => (
              <WordSmall
                key={word.id}
                text={word.name}
                star={true}
                isLogin={isLogin}
                index={index}
                handleListItemClick={handleListItemClick}
                listMode={listMode}
              />
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="container  fade-up">
          <div className="bigWordCard">
            <div id="flip-container" className="flip-container">
              <div className="flipper">
                <div className="front">
                  <div className="starBox">{isStar}</div>
                  <div className="shuffleBox">
                    <ShuffleRoundedIcon
                      color="blue"
                      sx={{ fontSize: 45 }}
                      onClick={() => shuffle()}
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
                  {wordList.map((word, index) => (
                    <ListItem
                      disablePadding
                      id={"section" + word.id}
                      key={"id" + word.id}
                    >
                      <ListItemButton
                        selected={wordNumber === index}
                        onClick={(event) => handleListItemClick(index)}
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

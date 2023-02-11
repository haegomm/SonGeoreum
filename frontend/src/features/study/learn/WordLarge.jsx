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
  const [starList, setStarList] = useState(); // 즐겨찾기 단어 목록
  const [blockListMode, setBlockListMode] = useState(false); // 작은 단어장 리스트

  useEffect(() => {
    async function getInfo() {
      const data = await axios.get(`/api/words?categoryId=${categoryNum}`);
      setWordList(() => data.data);
      console.log(data.data);
      setWordNumber(() => 0);
      setStartNumber(() => data.data[0].id);
      setEndNumber(data.data.length - 1);
      if (isLogin) {
        async function getStar() {
          const favorites = await axios.get(`/api/favorites`);
          console.log("즐겨찾기 확인해보자 >> ", favorites.data);
          if (favorites.data) {
            let list = [];
            for (let i = 0; i < favorites.data.length; i++) {
              // console.log(favorites.data[i].categoryId);
              if (favorites.data[i].categoryId == categoryNum) {
                list.push(favorites.data[i]);
              }
            }
            console.log(list);

            let favoritesList = [];
            for (let i = 0; i < data.data.length; i++) {
              let status = false;
              for (let j = 0; j < favorites.data.length; j++) {
                if (data.data[i].id === favorites.data[j].id) status = true;
              }
              favoritesList.push(status);
            }
            console.log(favoritesList);
            setStarList(favoritesList);

            if (favoritesList[0] === true) setStar(true);
          }
        }
        getStar();
      }
    }
    getInfo();
  }, []);

  const starInfo = (num) => {
    // console.log("즐겨찾기를 확인?");
    if (isLogin && wordList) {
      // async function getStar() {
      //   const data = await axios.get(`/api/favorites/word/${num}`);
      //   console.log(`즐겨찾기 확인해보자 ${num} >> `, data.data.message);
      //   const isStar = data.data.message;
      //   if (isStar === "success") setStar(() => true);
      //   else setStar(() => false);
      // }
      // getStar();
      // console.log(starList[num]);
      if (starList[num] === true) setStar(() => true);
      else setStar(() => false);
    }
  };

  const starInfoSmallWord = (num) => {
    console.log("작은 단어장에서 즐겨찾기 확인");
    async function getStar() {
      const data = await axios.get(`/api/favorites/word/${num}`);
      console.log(`즐겨찾기 확인해보자 ${num} >> `, data.data.message);
      const isStar = data.data.message;
      if (isStar === "success") return true;
      else return false;
    }
    getStar();
  };

  const handleListItemClick = (index) => {
    console.log("index 확인중..", index);
    setWordNumber(index);
    starInfo(index);
    console.log(wordNumber);
  };

  const numberPlus = () => {
    const num = wordNumber;
    setWordNumber(num + 1);
    console.log(num + 1);
    starInfo(num + 1);
  };

  const numberMinus = () => {
    const num = wordNumber;
    setWordNumber(num - 1);
    console.log(num - 1);
    starInfo(num - 1);
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

  const starPost = (num, id) => {
    console.log("즐겨찾기 >> ", id);
    setStar(true);
    async function postStar() {
      const data = await axios.post(`/api/favorites`, {
        wordId: id,
      });
      console.log(data);
    }
    postStar();
    const list = starList;
    list[num] = true;
    setStarList(list);
  };

  const starDelete = (num, id) => {
    console.log("즐겨찾기 해제 >> ", id);
    setStar(false);
    async function deleteStar() {
      const data = await axios.delete(`/api/favorites`, {
        wordId: id,
      });
      console.log(data);
    }
    deleteStar();
    const list = starList;
    list[num] = false;
    setStarList(list);
  };

  const isStar = star ? (
    <StarIcon
      color="yellow"
      sx={{ fontSize: 45 }}
      onClick={() => starDelete(wordNumber, wordNumber + startNumber)}
    />
  ) : (
    <StarIcon
      color="disabled"
      sx={{ fontSize: 45 }}
      onClick={() => starPost(wordNumber, wordNumber + startNumber)}
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
      if (isLogin) {
        async function getStar() {
          const favorites = await axios.get(`/api/favorites`);
          console.log("즐겨찾기 확인해보자 >> ", favorites.data);
          if (favorites.data) {
            let list = [];
            for (let i = 0; i < favorites.data.length; i++) {
              // console.log(favorites.data[i].categoryId);
              if (favorites.data[i].categoryId == categoryNum) {
                list.push(favorites.data[i]);
              }
            }
            console.log(list);

            let favoritesList = [];
            for (let i = 0; i < data.data.length; i++) {
              let status = false;
              for (let j = 0; j < favorites.data.length; j++) {
                if (data.data[i].id === favorites.data[j].id) status = true;
              }
              favoritesList.push(status);
            }
            console.log(favoritesList);
            setStarList(favoritesList);

            if (favoritesList[0] === true) setStar(true);
          }
        }
        getStar();
      }
    }
    shuffleInfo();
  };

  if (wordList && wordList.length > 0) {
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
                star={starList[index]}
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

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

export default function WordLarge({ isLogin, categoryNum, categoryName }) {
  const navigate = useNavigate();

  const [star, setStar] = useState(false);
  const [wordNumber, setWordNumber] = useState(0);
  const [startNumber, setStartNumber] = useState();
  const [endNumber, setEndNumber] = useState();
  const [wordList, setWordList] = useState();
  const [starList, setStarList] = useState();
  const [blockListMode, setBlockListMode] = useState(false);

  useEffect(() => {
    async function getInfo() {
      const data = await axios.get(`/api/words?categoryId=${categoryNum}`);
      setWordList(() => data.data);
      setWordNumber(() => 0);
      setStartNumber(() => data.data[0].id);
      setEndNumber(data.data.length - 1);
      if (isLogin) {
        async function getStar() {
          const favorites = await axios.get(`/api/favorites`);
          if (favorites.data) {
            let list = [];
            for (let i = 0; i < favorites.data.length; i++) {
              if (favorites.data[i].categoryId == categoryNum) {
                list.push(favorites.data[i]);
              }
            }

            let favoritesList = [];
            for (let i = 0; i < data.data.length; i++) {
              let status = false;
              for (let j = 0; j < favorites.data.length; j++) {
                if (data.data[i].id === favorites.data[j].id) status = true;
              }
              favoritesList.push(status);
            }
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
    if (isLogin && wordList) {
      if (starList[num] === true) setStar(() => true);
      else setStar(() => false);
    }
  };

  const starInfoSmallWord = (num) => {
    async function getStar() {
      const data = await axios.get(`/api/favorites/word/${num}`);
      const isStar = data.data.message;
      if (isStar === "success") return true;
      else return false;
    }
    getStar();
  };

  const handleListItemClick = (index) => {
    setWordNumber(index);
    starInfo(index);
  };

  const numberPlus = () => {
    const num = wordNumber;
    setWordNumber(num + 1);
    starInfo(num + 1);
  };

  const numberMinus = () => {
    const num = wordNumber;
    setWordNumber(num - 1);
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
    setStar(true);
    async function postStar() {
      const data = await axios.post(`/api/favorites`, {
        wordId: id,
      });
    }
    postStar();
    const list = starList;
    list[num] = true;
    setStarList(list);
  };

  const starDelete = (num, id) => {
    setStar(false);
    async function deleteStar() {
      const data = await axios.delete(`/api/favorites`, {
        data: {
          wordId: id,
        },
      });
    }
    deleteStar();
    const list = starList;
    list[num] = false;
    setStarList(list);
  };

  const needLogin = () => {
    const gotoLogin = window.confirm(
      "회원만 이용 가능합니다. 로그인 하시겠습니까?"
    );
    if (gotoLogin) {
      navigate("/login");
    } else {
    }
  };

  const isStar = isLogin ? (
    star ? (
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
    )
  ) : (
    <StarIcon
      color="disabled"
      sx={{ fontSize: 45 }}
      onClick={() => needLogin()}
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
      setWordNumber(0);
      setStartNumber(data.data[0].id);
      setEndNumber(data.data.length - 1);
      if (isLogin) {
        async function getStar() {
          const favorites = await axios.get(`/api/favorites`);
          if (favorites.data) {
            let list = [];
            for (let i = 0; i < favorites.data.length; i++) {
              if (favorites.data[i].categoryId == categoryNum) {
                list.push(favorites.data[i]);
              }
            }

            let favoritesList = [];
            for (let i = 0; i < data.data.length; i++) {
              let status = false;
              for (let j = 0; j < favorites.data.length; j++) {
                if (data.data[i].id === favorites.data[j].id) status = true;
              }
              favoritesList.push(status);
            }
            setStarList(favoritesList);

            if (favoritesList[0] === true) setStar(true);
          }
        }
        getStar();
      }
    }
    shuffleInfo();
  };

  const toTest = () => {
    navigate("/test", { state: [categoryNum, categoryName] });
  };

  if (wordList && wordList.length > 0) {
    const media =
      categoryNum > 3 && wordList && wordList.length > 0 ? (
        <video
          src={wordList[wordNumber].contentUrl}
          autoPlay
          poster=""
          loop
        ></video>
      ) : (
        <img
          className="handImage"
          src={wordList[wordNumber].contentUrl}
          referrerPolicy="no-referrer"
        />
      );

    const smallWordList =
      isLogin && starList
        ? wordList.map((word, index) => (
            <WordSmall
              key={word.id}
              text={word.name}
              star={starList[index]}
              isLogin={isLogin}
              index={index}
              handleListItemClick={handleListItemClick}
              listMode={listMode}
            />
          ))
        : wordList.map((word, index) => (
            <WordSmall
              key={word.id}
              text={word.name}
              isLogin={isLogin}
              index={index}
              handleListItemClick={handleListItemClick}
              listMode={listMode}
            />
          ));

    if (blockListMode) {
      return (
        <div>
          <div className="fade-up">{smallWordList}</div>
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
              onclick={toTest}
            />
          </div>
        </div>
      );
    }
  }
}

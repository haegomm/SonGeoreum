import React, { useEffect } from "react";
import { Reset } from "styled-reset";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import CustomMuiTheme from "./theme";
import Game from "../features/game/openVidu/test";
import Navbar from "../common/navbar/Navbar";
import Home from "../features/home/Home";
import Login from "../features/auth/login/Login";
import Signup from "../features/auth/signup/Signup";
import KakaoLogin from "../features/auth/login/KakaoLogin";
import Result from "../features/game/openVidu/components/Result";
import Study from "../features/study/Study";
import Test from "../features/study/test/Test";
import MyVoca from "../features/voca/MyVoca";

import PrivateRoute from "../common/routes/PrivateRoute";
import PublicRoute from "../common/routes/PublicRoute";
import userAction from "../common/api/userAction";
import { getUserInfo } from "../common/api/authInfo";
import authAction from "../common/api/authAction";

import './app.scss'

function App() {
  const dispatch = useDispatch();
  // ThemeProvider로 기본 테마를 적용합니다.
  // CssBaseline로 theme를 전처리해줍니다
  // 현재 보여지는 페이지에 따라 nav 크기를 조절해줍니다.

  function reissueToken() {
    dispatch(userAction.issueAccessToken()).then((response) => {
      console.log("토큰 재발급시도", response);
      if (response.payload.message === "success") {
        console.log("토큰재발급 성공!");
        window.localStorage.setItem(
          "accessToken",
          response.payload.accessToken
        );
      } else {
        console.log("토큰재발급 실패ㅜㅜ");
      }
    });
  }

  useEffect(() => {
    const tokenIssue = setInterval(() => {
      if (access) {
        reissueToken();
      }
    }, 1200000);
  }, []);

  const access = authAction.isLogin();

  return (
    <div className="App">
      <Reset />
      <ThemeProvider theme={CustomMuiTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Navbar />}>
              {/* <Route index element={<Home />} />
              <Route path="study" element={<Study />} />
              <Route path="test" element={<Test />} />
              <Route path="*" element={<Home />} />
              <Route path="game" element={<Game />} />
              <Route path="oauth2/code/kakao" element={<KakaoLogin />} />
              <Route path="result" element={<Result />} /> */}
              {/* <Route path="api/oauth2/code/kakao" element={<KakaoLogin />} /> */}
              {/* <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="myvoca" element={<MyVoca />} /> */}

              {/* 최종 배포 시 상단 라우터를 지우고 아래 라우터를 활성화 */}
              <Route index element={<Home />} />
              <Route path="study" element={<Study />} />
              <Route path="test" element={<Test />} />
              <Route path="*" element={<Home />} />
              <Route path="game" element={<Game />} />
              <Route path="result" element={<Result />} />

              <Route
                path="signup"
                element={
                  <PublicRoute authenticated={access} component={<Signup />} />
                }
              />
              <Route
                path="login"
                element={
                  <PublicRoute authenticated={access} component={<Login />} />
                }
              />
              <Route
                path="oauth2/code/kakao"
                element={
                  <PublicRoute
                    authenticated={access}
                    component={<KakaoLogin />}
                  />
                }
              />

              <Route
                path="myvoca"
                element={
                  <PrivateRoute authenticated={access} component={<MyVoca />} />
                }
              />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;

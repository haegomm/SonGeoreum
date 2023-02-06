import * as React from "react";
import { Reset } from "styled-reset";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import CustomMuiTheme from "./theme";
import Game from "../features/game/openVidu/test";
import Navbar from "../common/navbar/Navbar";
import Home from "../features/home/Home";
import Login from "../features/auth/login/Login";
import Signup from "../features/auth/signup/Signup";
import KakaoLogin from "../features/auth/login/KakaoLogin";

function App() {
  // ThemeProvider로 기본 테마를 적용합니다.
  // CssBaseline로 theme를 전처리해줍니다
  // 현재 보여지는 페이지에 따라 nav 크기를 조절해줍니다.

  return (
    <div className="App">
      <Reset />
      <ThemeProvider theme={CustomMuiTheme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Navbar />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
              <Route path="game" element={<Game />} />
              <Route path="*" element={<Home />} />
              <Route path="/api/oauth2/code/kakao" element={<KakaoLogin />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;

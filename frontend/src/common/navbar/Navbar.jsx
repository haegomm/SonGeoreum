import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Route,
  Outlet,
  Link,
  NavLink,
} from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import "./Navbar.scss";
import { getUserInfo } from "../api/authInfo";
import NavbarSide from './NavbarSide'


export default function Navbar() {

  const pages = [
    { name: "학습하기", path: "/study" },
    { name: "게임하기", path: "/game" },
    { name: "알아보기", path: "/culture" },
  ]; // 페이지

  // const [auth, setAuth] = useState(true); // 로그인 유무
  const [isShort, setShort] = useState(true); // navBar 사이즈 조절
  const [isLogin, setIsLogin] = useState(false)

  const sizeLong = () => {
    setShort(false);
  };

  const sizeShort = () => {
    setShort(true);
  };
  useEffect(()=>{
    setIsLogin(getUserInfo().userId === true)
    console.log('나는유즈이펙트야')
    console.log('이 정보로 isLogin을 바꿨어',getUserInfo().userId)
    console.log('로그인상태바뀜', isLogin)
  }, [getUserInfo().userId])

  const onLoginHandler = (data) => {
    console.log(data, '데이터는 ')
    setIsLogin(data)
    console.log('로그인상태바뀜', isLogin)
  }

  const size = {
    short: {
      navHeight: 80,
      marginBottom: 60,
    },
    long: {
      navHeight: 330,
      marginBottom: 140,
    },
  };

  // customizing
  const sizeList = {
    navHeight: size.navHeight,
    appBarHeight: 80,
    appBarHeightPaddingTop: 8,
    borderRadiusSize: 20, // 전체 nav 모서리는 scss에서 수정
    appBarMarginBottom: size.marginBottom,
    // logo
    logo: "30px",
    logoWeight: 700,
    logoPaddingLeft: 60,
    // menu
    menu: "18px",
    menuWeight: 500,
    // iconButton
    iconButtonMargin: 24,

  };
  
  // useEffect(()=>{

  // })
  return (
    <div>
      <div
        className="navBar"
        style={{ height: isShort ? size.short.navHeight : size.long.navHeight }}
      ></div>
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <AppBar
          elevation={0}
          position="static"
          style={{
            height: sizeList.appBarHeight,
            borderBottomLeftRadius: sizeList.borderRadiusSize,
            borderBottomRightRadius: sizeList.borderRadiusSize,
            paddingTop: sizeList.appBarHeightPaddingTop,
            marginBottom: sizeList.appBarMarginBottom,
          }}
        >
          <Toolbar>
            <Typography
              fontSize={sizeList.logo}
              fontWeight={sizeList.logoWeight}
              color="secondary"
              component={Link} // anchor
              to="/" // 이동하는 링크입니다
              onClick={sizeShort}
              style={{
                paddingLeft: sizeList.logoPaddingLeft,
                textDecoration: "none",
              }}
              sx={{ flexGrow: 1 }}
            >
              손걸음
            </Typography>
            {pages.map((page) => (
              <MenuItem key={page.name}>
                <Typography
                  textAlign="center"
                  fontSize={sizeList.menu}
                  fontWeight={sizeList.menuWeight}
                  component={Link} // anchor
                  to={page.path} // 이동하는 링크입니다
                  onClick={sizeLong}
                  style={{
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  {page.name}
                </Typography>
              </MenuItem>
            ))}
            <NavbarSide onLoginHandler={onLoginHandler}/>
            <MenuItem>
                <Typography
                  textAlign="center"
                  fontSize={sizeList.menu}
                  fontWeight={sizeList.menuWeight}
                  component={Link} // anchor
                  to={"/login"} // 이동하는 링크입니다
                  style={{
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  로그인
                </Typography>
              </MenuItem>

            {/* 나중에 아래 주석 풀기 : 로그인 상태에 따라 로그인 버튼과 프로필 버튼 다르게 */}
            {/* {!getUserInfo.nickname ? (
              <NavbarSide onLoginHandler={onLoginHandler}/>
            ) : (
              <MenuItem>
                <Typography
                  textAlign="center"
                  fontSize={sizeList.menu}
                  fontWeight={sizeList.menuWeight}
                  component={Link} // anchor
                  to={"/login"} // 이동하는 링크입니다
                  style={{
                    textDecoration: "none",
                    color: "white",
                  }}
                >
                  로그인
                </Typography>
              </MenuItem>
            )} */}

          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </div>
  );
}

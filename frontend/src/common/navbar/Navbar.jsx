import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Route,
  Outlet,
  Link,
  NavLink,
  useLocation,
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
import NavbarSide from "./NavbarSide";
import authAction from "../api/authAction";
import backImg from "../../assets/navbar_background.png";
import logoImg from "../../assets/logo/logo_fill_yellow.png";

export default function Navbar() {
  const pages = [
    { name: "학습하기", path: "/study" },
    { name: "게임하기", path: "/game" },
  ];
  const location = useLocation();
  const [isShort, setShort] = useState(0);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/signup") {
      setShort(() => 3);
    } else if (path === "/study" || path === "/test" || path === "/myvoca") {
      setShort(() => 1);
    } else if (path === "/game") {
      setShort(() => 2);
    } else {
      setShort(() => 0);
    }
  }, [location]);

  const sizeLong = () => {
    setShort(1);
  };

  const sizeShort = () => {
    setShort(0);
  };

  const size = [
    {
      navHeight: 80,
      marginBottom: 60,
    },
    {
      navHeight: 330,
      marginBottom: 140,
    },
    {
      navHeight: "100vh",
      marginBottom: 140,
    },
    {
      navHeight: 0,
      marginBottom: 140,
    },
  ];

  const sizeList = {
    navHeight: size.navHeight,
    appBarHeight: 80,
    appBarHeightPaddingTop: 8,
    borderRadiusSize: 20,
    appBarMarginBottom: size.marginBottom,
    logo: "28px",
    logoWeight: 700,
    logoPaddingLeft: 60,
    menu: "18px",
    menuWeight: 500,
    iconButtonMargin: 24,
  };

  const customColor = isShort === 3 ? "#FFF9ED" : null;
  const customTextColor = isShort === 3 ? "#6488E5" : "white";

  return (
    <div>
      <div
        className="navBar"
        style={{
          height: size[isShort].navHeight,
        }}
      >
        <img src={backImg} width={"100%"} />
      </div>
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
            backgroundColor: "rgba(0, 0, 0, 0)",
          }}
        >
          <Toolbar>
            <Typography
              fontSize={sizeList.logo}
              fontWeight={sizeList.logoWeight}
              color="secondary"
              component={Link}
              to="/"
              onClick={sizeShort}
              style={{
                paddingLeft: sizeList.logoPaddingLeft,
                textDecoration: "none",
                lineHeight: "40px",
              }}
              sx={{ flexGrow: 1 }}
            >
              <img className="logoImg" src={logoImg} height={"32px"} />
              손걸음
            </Typography>
            {pages.map((page) => (
              <MenuItem key={page.name}>
                <Typography
                  textAlign="center"
                  fontSize={sizeList.menu}
                  fontWeight={sizeList.menuWeight}
                  component={Link}
                  to={page.path}
                  onClick={sizeLong}
                  style={{
                    textDecoration: "none",
                    color: customTextColor,
                  }}
                >
                  {page.name}
                </Typography>
              </MenuItem>
            ))}

            {authAction.isLogin() ? (
              <NavbarSide />
            ) : (
              <MenuItem>
                <Typography
                  textAlign="center"
                  fontSize={sizeList.menu}
                  fontWeight={sizeList.menuWeight}
                  component={Link}
                  to={"/login"}
                  style={{
                    textDecoration: "none",
                    color: customTextColor,
                  }}
                >
                  로그인
                </Typography>
              </MenuItem>
            )}
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </div>
  );
}

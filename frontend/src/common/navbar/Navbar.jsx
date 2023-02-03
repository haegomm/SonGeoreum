import * as React from "react";
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

export default function Navbar() {
  const pages = [
    { name: "학습하기", path: "/study" },
    { name: "게임하기", path: "/game" },
    { name: "알아보기", path: "/culture" },
  ]; // 페이지
  const [auth, setAuth] = React.useState(true); // 로그인 유무
  const [isShort, setShort] = React.useState(true); // navBar 사이즈 조절

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const sizeChange = () => {
    setShort(!isShort);
  };

  const sizeLong = () => {
    setShort(false);
  };

  const sizeShort = () => {
    setShort(true);
  };

  const size = {
    short: {
      navHeight: 80,
      marginBottom: 60,
    },
    long: {
      navHeight: 520,
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
    logo: "36px",
    logoWeight: 700,
    logoPaddingLeft: 60,
    // menu
    menu: "24px",
    menuWeight: 500,
    // iconButton
    iconButtonMargin: 24,
  };

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
            {auth ? (
              <div>
                {/* 추후 IconButton이 아닌 이미지 버튼으로 수정합니다. */}
                <IconButton
                  style={{
                    marginLeft: sizeList.iconButtonMargin,
                    marginRight: sizeList.iconButtonMargin,
                  }}
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  // onClick={handleMenu} 이부분에는 사이드바를 여는 함수가 들어갑니다
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </div>
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
            )}
          </Toolbar>
        </AppBar>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={auth}
                onChange={handleChange}
                aria-label="login switch"
              />
            }
            label={auth ? "Logout 상태일 때" : "Login 상태일 때"}
          />
        </FormGroup>
        <FormGroup>
          <FormControlLabel
            control={
              <Switch
                checked={isShort}
                onChange={sizeChange}
                aria-label="login switch"
              />
            }
            label={isShort ? "short 상태일 때" : "long 상태일 때"}
          />
        </FormGroup>
      </Box>
      <Outlet />
    </div>
  );
}

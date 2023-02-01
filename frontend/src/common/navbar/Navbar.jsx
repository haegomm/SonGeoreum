import * as React from "react";
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

export default function Navbar(props) {
  const { size } = props;
  const pages = ["학습하기", "게임하기", "알아보기"]; // 페이지
  const [auth, setAuth] = React.useState(true); // 로그인 유무

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

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  return (
    <div>
      <div className="navBar" style={{ height: sizeList.navHeight }}></div>
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
              component="a" // anchor
              href="/" // 이동하는 링크입니다
              style={{
                paddingLeft: sizeList.logoPaddingLeft,
                textDecoration: "none",
              }}
              sx={{ flexGrow: 1 }}
            >
              손걸음
            </Typography>
            {pages.map((page) => (
              <MenuItem key={page}>
                <Typography
                  textAlign="center"
                  fontSize={sizeList.menu}
                  fontWeight={sizeList.menuWeight}
                >
                  {page}
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
      </Box>
    </div>
  );
}

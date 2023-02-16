import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LinearProgress } from "@mui/material";

import authAction from "../api/authAction";
import { deleteUserInfo, getUserInfo } from "../api/authInfo";
import ModifyProfile from "./ModifyProfile";
import "./NavbarSide.scss";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import BookOutlinedIcon from "@mui/icons-material/BookOutlined";
import StarRateIcon from "@mui/icons-material/StarRate";
import { green, red, yellow } from "@mui/material/colors";

export default function NavbarSide() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const nickname = getUserInfo().nickname;
  const picture = getUserInfo().picture;
  const level = getUserInfo().level;
  const experience = getUserInfo().experience;
  const graphExperience = (experience % 10) * 10;

  console.log(experience + " " + graphExperience);

  const onLogoutHandler = (e) => {
    dispatch(authAction.logout()).then((response) => {
      console.log(response.payload);
      if (response.payload.message === "success") {
        alert("로그아웃이 완료되었습니다");
        window.location.replace("/");
        deleteUserInfo();
      } else {
        alert("로그아웃에 실패하였습니다. 다시 시도해주세요");
      }
    });
  };

  const onMyVocaaHandler = (e) => {
    console.log("단어장으로 이동해용~");
    navigate("/myvoca");
  };

  const [state, setState] = useState({ right: false });

  const toggleDrawer = (anchor, open) => (event) => {
    console.log(authAction.isLogin());
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const list = (anchor) => (
    <Box sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 270 }} role="presentation">
      <List>
        <ListItem key="profileBlock">
          <img src={picture} className="profileImage" alt="profileImage" />
        </ListItem>
        <ListItem key="ProfileInfo" disablePadding>
          <div className="userNickname">{nickname} 님</div>
        </ListItem>
        <ListItem>
          <div className="levelString">Lv.{level}</div>
          <LinearProgress
            variant="determinate"
            value={graphExperience}
            sx={{
              margin: 0,
              marginTop: "20px",
              width: "200px",
              height: 10,
              marginLeft: "18px",
              marginRight: "12px",
              borderRadius: 5,
              // "& .css-jjlizq-MuiLinearProgress-bar1": {
              //   backgroundColor: "#90D28A",
              // },
            }}
          />
        </ListItem>
      </List>
      {/* <Divider /> */}
      <List onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
        <ListItem key="logoutButton" disablePadding>
          <ListItemButton className="logoutButton">
            <LogoutOutlinedIcon className="logoutIcon"></LogoutOutlinedIcon>
            <ListItemText
              primary="로그아웃"
              className="logoutString"
              onClick={() => {
                onLogoutHandler();
              }}
            />
            {/* <LogoutOutlinedIcon className="logoutIcon"></LogoutOutlinedIcon> */}
            {/* 로그아웃 */}
          </ListItemButton>
        </ListItem>
        <ListItem key="myVocaButton" disablePadding>
          <ListItemButton>
            <StarRateIcon className="myVocaIcon"></StarRateIcon>
            <ListItemText primary="나의 단어장" className="myVocaString" onClick={onMyVocaaHandler} />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem key="modifyProfileButton" disablePadding>
          <ListItemButton>
            <ModifyProfile className="modifyBase" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <React.Fragment key="right">
        <Button onClick={toggleDrawer("right", true)}>
          <img className="drawerButton" src={picture} alt="profileImage" />
        </Button>
        <Drawer
          PaperProps={{
            sx: {
              backgroundColor: "#6488E5",
            },
          }}
          anchor="right"
          open={state["right"]}
          onClose={toggleDrawer("right", false)}
        >
          <div className="drawerCloseDiv">
            <IconButton className="drawerCloseButton" onClick={toggleDrawer("right", false)}>
              <ChevronRightIcon fontSize="large" className="drawerColseArrow" />
            </IconButton>
          </div>
          {list("right")}
        </Drawer>
      </React.Fragment>
    </div>
  );
}

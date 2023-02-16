import React, { Component } from "react";
import "./ToolbarComponent.css";

import { AppBar } from "@mui/material";
import { Toolbar } from "@mui/material";
import Videocam from "@mui/icons-material/Videocam";
import VideocamOff from "@mui/icons-material/VideocamOff";
import StopScreenShare from "@mui/icons-material/StopScreenShare";
import { IconButton } from "@mui/material";

const logo = require("../../../../../assets/logo/logo_fill_yellow.png");

export default class ToolbarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { fullscreen: false };
    this.camStatusChanged = this.camStatusChanged.bind(this);
    this.screenShare = this.screenShare.bind(this);
    this.stopScreenShare = this.stopScreenShare.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.switchCamera = this.switchCamera.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.toggleChat = this.toggleChat.bind(this);
  }

  camStatusChanged() {
    this.props.camStatusChanged();
  }

  screenShare() {
    this.props.screenShare();
  }

  stopScreenShare() {
    this.props.stopScreenShare();
  }

  toggleFullscreen() {
    this.setState({ fullscreen: !this.state.fullscreen });
    this.props.toggleFullscreen();
  }

  switchCamera() {
    this.props.switchCamera();
  }

  leaveSession() {
    this.props.leaveSession();
  }

  toggleChat() {
    this.props.toggleChat();
  }

  render() {
    const mySessionId = this.props.sessionId;
    const localUser = this.props.user;
    return (
      <AppBar className="toolbar" id="header">
        <Toolbar className="toolbar">
          <div id="navSessionInfo">
            <img id="header_img" alt="OpenVidu Logo" src={logo} />
          </div>
          <div className="buttonsContent">
            <IconButton
              color="inherit"
              className="navButton"
              id="navCamButton"
              onClick={this.camStatusChanged}
            >
              {localUser !== undefined && localUser.isVideoActive() ? (
                <Videocam />
              ) : (
                <VideocamOff color="secondary" />
              )}
            </IconButton>
            {localUser !== undefined && localUser.isScreenShareActive() && (
              <IconButton onClick={this.stopScreenShare} id="navScreenButton">
                <StopScreenShare color="secondary" />
              </IconButton>
            )}
            <IconButton
              color="secondary"
              className="navButton"
              onClick={this.leaveSession}
              id="navLeaveButton"
            ></IconButton>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

import * as React from "react";

import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";

export default function TestInput() {
  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 400,
        margin: "16px",
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="정답을 입력해주세요"
        inputProps={{ "aria-label": "search google maps" }}
      />

      <IconButton color="primary" aria-label="upload picture" component="label">
        <SendIcon />
      </IconButton>
    </Paper>
  );
}

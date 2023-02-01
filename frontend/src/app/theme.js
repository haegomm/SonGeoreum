import { createTheme } from "@mui/material/styles";

const CustomMuiTheme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#6488e5",
    },
    secondary: {
      main: "#f9be7d",
    },
    background: {
      default: "#fff9ed",
      paper: "#ffffff",
    },
    text: {
      primary: "#22254c",
      secondary: "#2b2b2b",
      disabled: "#777777",
      hint: "#fff",
    },
    error: {
      main: "#e56372",
    },
    warning: {
      main: "#f9be7d",
    },
    success: {
      main: "#90de8a",
    },
    info: {
      main: "#6488e5",
    },
  },
  typography: {
    fontFamily: ["IBM Plex Sans KR"].join(","),
  },
  spacing: 8,
});
export default CustomMuiTheme;

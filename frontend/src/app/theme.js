import { createTheme } from "@mui/material/styles";

const defaultTheme = createTheme();
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
    disabled: defaultTheme.palette.augmentColor({
      color: { main: "#C6C6C6" },
      name: "disabled",
    }),
    blue: defaultTheme.palette.augmentColor({
      color: { main: "#6488e5" },
      name: "blue",
    }),
    yellow: defaultTheme.palette.augmentColor({
      color: { main: "#f9be7d" },
      name: "yellow",
    }),
    green: defaultTheme.palette.augmentColor({
      color: { main: "#90de8a" },
      name: "green",
    }),
    red: defaultTheme.palette.augmentColor({
      color: { main: "#e56372" },
      name: "red",
    }),
    white: defaultTheme.palette.augmentColor({
      color: { main: "#ffffff" },
      name: "white",
    }),
  },
  typography: {
    fontFamily: ["Pretendard-Regular"].join(","),
  },
  spacing: 8,
});
export default CustomMuiTheme;

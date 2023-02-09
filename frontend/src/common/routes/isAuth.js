import { getUserInfo } from "../api/authInfo";

const isLogin = () => !!getUserInfo();

export default isLogin;
import React, { useEffect } from "react";
import { SpinnerCircular } from "spinners-react";
import axios from "../../../common/api/https";
import { saveUserInfo } from "../../../common/api/authInfo";

const KakaoLogin = (props) => {
  let params = new URL(document.URL).searchParams;
  let code = params.get("code");

  useEffect(() => {
    async function kakaoLogin() {
      const data = await axios.get(`/api/user/oauth2/kakao?code=${code}`);
      if (data.data.message === "success") {
        saveUserInfo(data.data);
        alert("로그인 성공!");
        window.location.replace("/");
      } else {
        alert("로그인에 실패했습니다. 다시 시도해주세요");
      }
    }
    kakaoLogin();
  }, [code]);

  return (
    <div>
      <div>
        <SpinnerCircular
          size={90}
          thickness={180}
          speed={100}
          color="rgba(57, 82, 172, 1)"
          secondaryColor="rgba(57, 78, 172, 0.22)"
        />
      </div>
      카카오 로그인 중...
    </div>
  );
};

export default KakaoLogin;

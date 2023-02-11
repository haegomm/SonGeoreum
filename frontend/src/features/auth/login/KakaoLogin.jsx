import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import { SpinnerCircular } from "spinners-react";
// import authAction from "../../../common/api/authAction";
import axios from '../../../common/api/https';
import { saveUserInfo } from "../../../common/api/authInfo";

const KakaoLogin = (props) => {
  // const dispatch = useDispatch()
  // const navigate = useNavigate();

  // const href = window.location.href
  let params = new URL(document.URL).searchParams
  let code = params.get("code")
  console.log(code)

  useEffect(() => {
    async function kakaoLogin() {
      const data = await axios.get(
        `/api/user/oauth2/kakao?code=${code}`
        );
        if (data.data.message === 'success') {
          saveUserInfo(data.data)
          alert('로그인 성공!')
          window.location.replace("/")
          // navigate('/');
        } else{
          alert('로그인에 실패했습니다. 다시 시도해주세요');
        }
      console.log('백한테 보내줬다!', data)
    }
    kakaoLogin()}
  ,[code])


  // const kakao = async () => {
  //   await (authAction.kakaoLogin(code))
  //   .then((response) => {
  //     console.log('나 리스폰스', response)
  //     if (response.payload.message === 'success') {
  //       saveUserInfo(response.payload)
  //       console.log('카카오 성공!')
  //       window.location.replace("/")
  //     } else{
  //       alert('로그인에 실패했습니다. 다시 시도해주세요');
  //     }
  //   })}
  
  //   useEffect(() => {
  //     kakao()
  //     }, [])

  // useEffect(
  //   dispatch(authAction.kakaoLogin(code)).then((response) => {
  //     if (response.payload.kakakoSuccess) {
  //       console.log('카카오 성공!')
  //       // saveUserInfo(response.payload.user)
  //       navigate('/');
  //     } else{
  //       alert('카카오 로그인에 실패했습니다. 다시 시도해주세요');
  //     }
  //   })
  // )
  return(
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
  )
}  

export default KakaoLogin;
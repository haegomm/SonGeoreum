import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SpinnerCircular } from "spinners-react";

const kakaoLogin = (props) => {
  const dispatch = useDispatch()

  const href = window.location.href
  let params = new URL(document.URL).searchParams
  let code = params.get("code")

  useEffect(
    dispatch(authAction.kakaoLogin(code)).then((response) => {
      if (response.payload.kakakoSuccess) {
        console.log('카카오 성공!')
        // saveUserInfo(response.payload.user)
        navigate('/');
      } else{
        alert('카카오 로그인에 실패했습니다. 다시 시도해주세요');
      }
    })
  )

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

export default
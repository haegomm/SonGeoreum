import * as React from "react";
import TestScreen from "./TestScreen";
import WordLarge from "./WordLarge";
import WordSmall from "./WordSmall";
import TopCard from "./TopCard";
import TestInput from "./TestInput";
import TestAnswer from "./TestAnswer";

import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

export default function CardTest() {
  const [auth, setAuth] = React.useState(true); // 로그인 유무

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  return (
    <div>
      <p>Test Custom Card Component</p>
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
      <div>
        <p>1. 테스트 (정답영상)</p>
        <TestScreen
          isLogin={auth}
          link={
            "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191004/624421/MOV000244910_700X466.mp4"
          }
        />
      </div>
      <div>
        <p>2. 테스트 (손모션인식)</p>
        Test 제작 시 추가 예정 (Canvas 직접 커스텀 필요)
        <TestScreen isLogin={auth} />
      </div>
      <div>
        <p>3. 단어장 (큰) + 단어 리스트 (스크롤 가능한) </p>
        <WordLarge
          isLogin={auth}
          link={
            "http://sldict.korean.go.kr/multimedia/multimedia_files/convert/20191004/624421/MOV000244910_700X466.mp4"
          }
          ck
        />
      </div>
      <div>
        <p>4. 단어장 (작은)</p>
        <WordSmall text="test" star={true} isLogin={auth} />
        <WordSmall text="test" star={false} isLogin={auth} />
        <WordSmall text="test" star={true} isLogin={auth} />
        <WordSmall text="test" star={false} isLogin={auth} />
      </div>
      <div>
        <p>5. 상단 제시어 + 결과 </p>
        <TopCard text="test" color="black" />
        <TopCard text="정답" color="green" />
      </div>
      <div>
        <p>6. 정답 입력 input</p>
        <TestInput />
      </div>
      <div>
        <p>7. 오답 시 정답 </p>
        <TestAnswer myInput="my input" answer="answer" />
      </div>
    </div>
  );
}

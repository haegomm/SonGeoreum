import Button from "./Button";

export default function ButtonTest() {
  return (
    <div className="HomePage">
      <div>Test Custom Button Component</div>
      <div>
        <p>0. 기본 버튼</p>
        <Button text="기본" type="default" backgroundColor="blue" />
      </div>
      <div>
        <p>1. 다음 버튼</p>
        <Button text="다음" type="next" backgroundColor="blue" disable={true} />
        <Button
          text="다음"
          type="next"
          backgroundColor="blue"
          disable={false}
        />
      </div>
      <div>
        <p>2. 테스트모드선택 버튼</p>
        <Button
          text="수어를 맞히기"
          type="testModeSelect"
          backgroundColor="blue"
          disable={true}
        />
        <Button
          text="수어를 맞히기"
          type="testModeSelect"
          backgroundColor="blue"
          disable={false}
        />
      </div>
      <div>
        <p>3. 학습하기-테스트 버튼</p>
        <Button
          text="TEST"
          type="learnToTest"
          backgroundColor="blue"
          disable={true}
        />
        <Button
          text="TEST"
          type="learnToTest"
          backgroundColor="blue"
          disable={false}
        />
      </div>
      <div>
        <p>4. 테스트시작 버튼</p>

        <Button
          text="시작"
          type="testStart"
          backgroundColor="red"
          disable={true}
        />
        <Button
          text="시작"
          type="testStart"
          backgroundColor="red"
          disable={false}
        />
      </div>
      <div>
        <p>5. 게임시작 버튼</p>
        <Button
          text="START"
          type="gameStart"
          backgroundColor="blue"
          disable={true}
        />
        <Button
          text="START"
          type="gameStart"
          backgroundColor="blue"
          disable={false}
        />
      </div>
      <div>
        <p>6. 문제 패스, 테스트 종료, 다시하기 버튼</p>
        <Button text="PASS" type="pass" backgroundColor="yellow" />
        <Button text="종료" type="pass" backgroundColor="red" />
        <Button text="다시하기" type="pass" backgroundColor="yellow" />
      </div>
      <div>
        <p>7. 웹캠 테스트, 게임 시작하기 버튼</p>
        <Button text="웹캠 테스트" type="webcamTest" backgroundColor="yellow" />
        <Button text="입장하기" type="webcamTest" backgroundColor="blue" />
      </div>
      <div>
        <p>8. 매칭 나가기 버튼</p>
        <Button text="나가기" type="exit" backgroundColor="white" />
      </div>
    </div>
  );
}

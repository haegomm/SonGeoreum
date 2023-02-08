import LargeButton from "./LargeButton";
import TextButton from "./TextButton";
import CategoryButton from "./CategoryButton";

export default function ButtonTest() {
  return (
    <div className="HomePage">
      <div>Test Custom LargeButton Component</div>
      <div>
        <p>0. 기본 버튼</p>
        <LargeButton text="기본" type="default" backgroundColor="blue" />
      </div>
      <div>
        <p>1. 다음 버튼</p>
        <LargeButton
          text="다음"
          type="next"
          backgroundColor="blue"
          disable={true}
        />
        <LargeButton
          text="다음"
          type="next"
          backgroundColor="blue"
          disable={false}
        />
      </div>
      <div>
        <p>2. 테스트모드선택 버튼</p>
        <LargeButton
          text="수어를 맞히기"
          type="testModeSelect"
          backgroundColor="blue"
          disable={true}
        />
        <LargeButton
          text="수어를 맞히기"
          type="testModeSelect"
          backgroundColor="blue"
          disable={false}
        />
      </div>
      <div>
        <p>3. 학습하기-테스트 버튼</p>
        <LargeButton
          text="TEST"
          type="learnToTest"
          backgroundColor="blue"
          disable={true}
        />
        <LargeButton
          text="TEST"
          type="learnToTest"
          backgroundColor="blue"
          disable={false}
        />
      </div>
      <div>
        <p>4. 테스트시작 버튼</p>

        <LargeButton
          text="시작"
          type="testStart"
          backgroundColor="red"
          disable={true}
        />
        <LargeButton
          text="시작"
          type="testStart"
          backgroundColor="red"
          disable={false}
        />
      </div>
      <div>
        <p>5. 게임시작 버튼</p>
        <LargeButton
          text="START"
          type="gameStart"
          backgroundColor="blue"
          disable={true}
        />
        <LargeButton
          text="START"
          type="gameStart"
          backgroundColor="blue"
          disable={false}
        />
      </div>
      <div>
        <p>6. 문제 패스, 테스트 종료, 다시하기 버튼</p>
        <LargeButton text="PASS" type="pass" backgroundColor="yellow" />
        <LargeButton text="종료" type="pass" backgroundColor="red" />
        <LargeButton text="다시하기" type="pass" backgroundColor="yellow" />
      </div>
      <div>
        <p>7. 웹캠 테스트, 게임 시작하기 버튼</p>
        <LargeButton
          text="웹캠 테스트"
          type="webcamTest"
          backgroundColor="yellow"
        />
        <LargeButton text="입장하기" type="webcamTest" backgroundColor="blue" />
      </div>
      <div>
        <p>8. 매칭 나가기 버튼</p>
        <LargeButton text="나가기" type="exit" backgroundColor="white" />
      </div>
      <div>
        <p>글자 버튼</p>
        <div>
          <TextButton text="LEARN" color="yellow" />
          <TextButton text="STUDY" color="yellow" />
        </div>
        <div>
          <TextButton text="배움방" color="yellow" />
          <TextButton text="도전방" color="yellow" />
        </div>
      </div>
      <div>
        <p>카테고리 버튼</p>
        <CategoryButton
          text="카테고리"
          link="https://picsum.photos/70/30"
          color="red"
        />
        <CategoryButton
          text="카테고리"
          link="https://picsum.photos/70/30"
          color="yellow"
        />
      </div>
    </div>
  );
}

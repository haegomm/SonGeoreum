import Button from "@mui/material/Button";

// button customizing
const typeNameList = [
  "default", // 0: default (기본)
  "next", // 1: next (다음)
  "testModeSelect", // 2: testModeSelect (테스트모드선택)
  "learnToTest", // 3: learnToTest (학습하기->테스트)
  "testStart", // 4: testStart (테스트시작)
  "gameStart", // 5: gameStart (게임시작)
  "pass", // 6: pass (다음문제)
  "webcamTest", // 7: webcamTest (웹캠테스트)
  "exit", // 8: exit (게임매칭 나가기)
];
const typeList = [
  {
    // 0: default 버튼
    variant: "contained",
    width: 200,
    height: 50,
    borderRadius: 20,
    fontSize: 20,
    fontWeight: 500,
    color: "white",
  },
  {
    // 1: next 버튼
    variant: "contained",
    width: 192,
    height: 72,
    borderRadius: 10,
    fontSize: 40,
    fontWeight: 700,
    color: "white",
  },
  {
    // 2: testModeSelect 버튼
    variant: "contained",
    width: 256,
    height: 108,
    borderRadius: 20,
    fontSize: 32,
    fontWeight: 700,
    color: "white",
  },
  {
    // 3: learnToTest 버튼
    variant: "contained",
    width: 216,
    height: 64,
    borderRadius: 10,
    fontSize: 40,
    fontWeight: 500,
    color: "white",
  },
  {
    // 4: testStart 버튼
    variant: "contained",
    width: 192,
    height: 72,
    borderRadius: 10,
    fontSize: 40,
    fontWeight: 500,
    color: "white",
  },
  {
    // 5: gameStart 버튼
    variant: "contained",
    width: 216,
    height: 64,
    borderRadius: 20,
    fontSize: 32,
    fontWeight: 500,
    color: "white",
  },
  {
    // 6: pass 버튼
    variant: "contained",
    width: 168,
    height: 64,
    borderRadius: 20,
    fontSize: 32,
    fontWeight: 700,
    color: "white",
  },
  {
    // 7: webcamTest 버튼
    variant: "contained",
    width: 336,
    height: 88,
    borderRadius: 90,
    fontSize: 40,
    fontWeight: 700,
    color: "white",
  },
  {
    // 8: eixt 버튼
    variant: "contained",
    width: 144,
    height: 72,
    borderRadius: 90,
    fontSize: 32,
    fontWeight: 500,
    color: "black",
  },
];

export default function LargeButton({
  text,
  type,
  backgroundColor,
  disable,
  onclick,
}) {
  console.log({ text, type, backgroundColor, disable, onclick });
  const disabled = disable ? disable : false;
  const onclickMethod = onclick ? onclick : undefined;

  let selectedType = typeList[0];
  for (let i = 0; i < typeNameList.length; i++) {
    if (typeNameList[i] === type) {
      selectedType = typeList[i];
    }
  }
  console.log(selectedType);

  return (
    <Button
      variant={selectedType.variant}
      onClick={onclickMethod}
      color={backgroundColor}
      disabled={disabled}
      style={{
        width: selectedType.width,
        height: selectedType.height,
        borderRadius: selectedType.borderRadius,
        fontSize: selectedType.fontSize,
        fontWeight: selectedType.fontWeight,
        color: selectedType.color,
      }}
    >
      {text}
    </Button>
  );
}

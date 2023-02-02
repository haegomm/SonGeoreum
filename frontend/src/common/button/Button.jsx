import Button from "@mui/material/Button";

// button customizing
// 0: default (기본), 1: next (다음), 2: testModeSelect (테스트모드선택)
// 3:
const typeNameList = ["default", "next", "testModeSelect", "webcamTest"];
const typeList = [
  {
    // default 버튼
    variant: "contained",
    href: "",
    width: 200,
    height: 50,
    borderRadius: 20,
    fontSize: 20,
    fontWeight: 500,
    color: "white",
  },
  {
    // next 버튼
    variant: "contained",
    href: "",
    width: 192,
    height: 72,
    borderRadius: 10,
    fontSize: 40,
    fontWeight: 700,
    color: "white",
  },
  {
    // testModeSelect 버튼
    variant: "contained",
    href: "",
    width: 256,
    height: 108,
    borderRadius: 20,
    fontSize: 32,
    fontWeight: 700,
    color: "white",
  },
  {
    // webcamTest 버튼
    variant: "contained",
    href: "",
    width: 336,
    height: 88,
    borderRadius: 90,
    fontSize: 40,
    fontWeight: 700,
    color: "white",
  },
];

export default function LargeButton({ text, type, backgroundColor, disable }) {
  console.log({ text, type, backgroundColor, disable });
  const disabled = disable ? disable : false;

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
      href={selectedType.href}
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

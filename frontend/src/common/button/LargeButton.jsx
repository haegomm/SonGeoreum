import Button from "@mui/material/Button";

const typeNameList = [
  "default",
  "next",
  "testModeSelect",
  "learnToTest",
  "testStart",
  "gameStart",
  "pass",
  "webcamTest",
  "exit",
];
const typeList = [
  {
    variant: "contained",
    width: 200,
    height: 50,
    borderRadius: 20,
    fontSize: 20,
    fontWeight: 500,
    color: "white",
  },
  {
    variant: "contained",
    width: 192,
    height: 72,
    borderRadius: 10,
    fontSize: 40,
    fontWeight: 700,
    color: "white",
  },
  {
    variant: "contained",
    width: 256,
    height: 108,
    borderRadius: 20,
    fontSize: 32,
    fontWeight: 700,
    color: "white",
  },
  {
    variant: "contained",
    width: "100%",
    height: 64,
    borderRadius: 20,
    fontSize: 40,
    fontWeight: 500,
    color: "white",
  },
  {
    variant: "contained",
    width: 192,
    height: 72,
    borderRadius: 10,
    fontSize: 40,
    fontWeight: 500,
    color: "white",
  },
  {
    variant: "contained",
    width: 216,
    height: 64,
    borderRadius: 20,
    fontSize: 32,
    fontWeight: 500,
    color: "white",
  },
  {
    variant: "contained",
    width: 168,
    height: 64,
    borderRadius: 20,
    fontSize: 32,
    fontWeight: 700,
    color: "white",
  },
  {
    variant: "contained",
    width: 336,
    height: 88,
    borderRadius: 90,
    fontSize: 40,
    fontWeight: 700,
    color: "white",
  },
  {
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
  margin,
}) {
  const disabled = disable ? disable : false;
  const onclickMethod = onclick ? onclick : undefined;
  const marginSize = margin ? margin : 16;

  let selectedType = typeList[0];
  for (let i = 0; i < typeNameList.length; i++) {
    if (typeNameList[i] === type) {
      selectedType = typeList[i];
    }
  }

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
        margin: marginSize,
      }}
    >
      {text}
    </Button>
  );
}

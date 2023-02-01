import Button from "@mui/material/Button";

// button customizing
const typeList = {
  // default 버튼
  default: {
    variant: "contained",
    href: "",
    backgroundColor: "primary",
    disabled: false,
    width: 200,
    height: 50,
    borderRadius: 20,
    fontSize: 20,
    fontWeight: 500,
    color: "white",
  },

  // 웹캠 테스트 버튼
  webcamTest: {
    variant: "contained",
    href: "",
    backgroundColor: "secondary",
    disabled: false,
    width: 336,
    height: 88,
    borderRadius: 90,
    fontSize: 40,
    fontWeight: 700,
    color: "white",
  },
};

export default function LargeButton({ text, type }) {
  const selectedType = type ? typeList.type : typeList.default;
  // console.log("rendering test");
  return (
    <Button
      variant={selectedType.variant}
      href={selectedType.href}
      color={selectedType.backgroundColor}
      disabled={selectedType.disabled}
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

import { Button } from "@mui/material";

export default function Test({ able, selectedTestMode }) {
  const selectedMode = (mode) => {
    selectedTestMode(mode);
  };

  return (
    <div className="TestPage">
      <div>
        <Button
          variant="contained"
          onClick={() => selectedMode("handToWord")}
          color="blue"
          style={{
            width: 256,
            height: 108,
            borderRadius: 20,
            fontSize: 32,
            fontWeight: 700,
            color: "white",
            margin: 16,
          }}
        >
          수어를 단어로
        </Button>
        <Button
          variant="contained"
          onClick={() => selectedMode("wordToHand")}
          color="blue"
          disabled={!able}
          style={{
            width: 256,
            height: 108,
            borderRadius: 20,
            fontSize: 32,
            fontWeight: 700,
            color: "white",
            margin: 16,
          }}
        >
          단어를 수어로
        </Button>
      </div>
    </div>
  );
}

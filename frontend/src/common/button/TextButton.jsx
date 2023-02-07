import "./TextButton.scss";

export default function TextButton({ text, selectedMode }) {
  const onClick = () => {
    console.log(text);
    selectedMode(text);
  };
  return (
    <button className="textButton" onClick={onClick}>
      {text}
    </button>
  );
}

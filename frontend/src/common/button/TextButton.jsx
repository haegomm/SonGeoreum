import "./TextButton.scss";

export default function TextButton({ text, onclick }) {
  const onclickMethod = onclick ? onclick : undefined;

  return (
    <button className="textButton" onclick={onclickMethod}>
      {text}
    </button>
  );
}

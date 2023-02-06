import "./CategoryButton.scss";

export default function CategoryButton({
  text,
  onclick,
  link,
  color,
  disable,
}) {
  const onclickMethod = onclick ? onclick : undefined;
  const disabled = disable ? disable : false;
  let customColor = "#f9be7d";
  if (color === "yellow") customColor = "#f9be7d";
  else if (color === "blue") customColor = "#6488e5";
  else if (color === "green") customColor = "#90de8a";
  else if ((color = "red")) customColor = "#e56372";
  else customColor = "gray";

  return (
    <button
      className="categoryButton"
      onClick={onclickMethod}
      style={{ backgroundColor: customColor, disabled: disabled }}
    >
      <div className="imageBox">
        <img className="image" src={link} alt="img"></img>
      </div>
      <div className="categoryText">{text}</div>
    </button>
  );
}

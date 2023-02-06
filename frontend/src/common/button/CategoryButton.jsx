import "./CategoryButton.scss";

export default function CategoryButton({
  text,
  index,
  selectedCategory,
  link,
  color,
  disable,
}) {
  const disabled = disable ? disable : false;
  let customColor = "#f9be7d";
  if (color === "yellow") customColor = "#f9be7d";
  else if (color === "blue") customColor = "#6488e5";
  else if (color === "green") customColor = "#90de8a";
  else if ((color = "red")) customColor = "#e56372";
  else customColor = "gray";

  const onClick = () => {
    console.log(index);
    selectedCategory(index);
  };

  return (
    <button
      className="categoryButton"
      onClick={onClick}
      style={{ backgroundColor: customColor, disabled: disabled }}
    >
      <div className="imageBox">
        <img className="image" src={link} alt="img"></img>
      </div>
      <div className="categoryText">{text}</div>
    </button>
  );
}

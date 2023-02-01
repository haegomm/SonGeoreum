import axios from "axios";

const TestApiCall = async () => {
  try {
    const response = await axios.get(
      "https://i8b106.p.ssafy.io/api/categories/"
    );
    console.log("response >>", response);
  } catch (err) {
    console.log("async Error");
  }
};

export default function Home() {
  return (
    <div className="HomePage">
      <button onClick={TestApiCall}>카테고리 요청</button>
      <div>이곳은 홈페이지 입니다.</div>
    </div>
  );
}

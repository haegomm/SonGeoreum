import axios from "axios";
import Grid from "@mui/material/Grid";

import ButtonTest from "../../common/button/ButtonTest";
import MotionTest from "../study/test/MotionTest";
import CardTest from "../../common/card/CardTest";

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
    <Grid container justifyContent="center">
      <Grid item xs={8}>
        <div className="HomePage">
          <button onClick={TestApiCall}>카테고리 요청</button>
          <div>이곳은 홈페이지 입니다.</div>
          {/* <MotionTest>use_script</MotionTest> */}
          <ButtonTest />
          <CardTest />
        </div>
      </Grid>
    </Grid>
  );
}

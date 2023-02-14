import axios from "axios";
import Grid from "@mui/material/Grid";

import ButtonTest from "../../common/button/ButtonTest";
import MotionTest from "../study/test/MotionTest";
import CardTest from "../../common/card/CardTest";
import HomeRanking from "./HomeRanking";
import Carousel from "./Carousel";
import CarouselMui from "./CarouselMui";

import './home.scss'

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-body">
        {/* <div><CarouselMui /></div> */}
        {/* <Carousel /> */}
      </div>

      <div className="ranking">
        <div><HomeRanking /></div>
      </div>
    </div>
    // <Grid container justifyContent="center">
    //   <Grid item xs={8}>
    //     <div className="HomePage">
    //       <button onClick={TestApiCall}>카테고리 요청</button>
    //     </div>
    //   </Grid>
    //   <Grid item xs={8}>
    //   </Grid>
    // </Grid>
  );
}

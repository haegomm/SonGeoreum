import React from 'react'
import './HomeScroll.scss'
import $ from "jquery";

import homeImages from '../../assets/home/homeImage';

function HomeScroll() {
  
  // const onScrollHandler = (e) => {
  //   e.preventDefault();

  // }

  $(function() {
    $('a[href*=#]').on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
    });
  });



  return (
    <div className='homeScrollContainer'>

      <section id="section01" class="demo">
        <div className='container01'>
          <div className='textbox01'>
            <p className='subtext01'>당신과 함께하는 첫 걸음,</p>
            <p className='maintext01'>손:걸음</p>
          </div>
          <div>
            <img src={homeImages[0]} className='img01'/>
          </div>
        </div>
    {/* <h1>Scroll Down Button #1</h1> */}
      <a href="#section02"><span></span>Scroll</a>
    </section>
  <section id="section02" class="demo">
    {/* <h1>Scroll Down Button #2</h1> */}
    <div className='container02'>
          <div>
            <img src={homeImages[1]} className='img02'/>
          </div>
          <div className='textbox02'>
            <p className='subtext02'>STEP 1</p>
            <p className='maintext02'>수어도 한 걸음부터!</p>
            <div className='context02'>
              <p></p>
            </div>
          </div>
        </div>
    <a href="#section03"><span></span>Scroll</a>
  </section>
  <section id="section03" class="demo">
    {/* <h1>Scroll Down Button #3</h1> */}
    <div className='container03'>
          <div className='textbox03'>
            <p className='subtext03'>STEP 2</p>
            <p className='maintext03'>모션인식으로 재미있게!</p>
            <div className='context03'>
              <p></p>
            </div>
          <div>
            <img src={homeImages[2]} className='img03'/>
          </div>
          </div>
        </div>
    <a href="#section04"><span></span>Scroll</a>
  </section>
  <section id="section04" class="demo">
    {/* <h1>Scroll Down Button #4</h1> */}
    <div className='container04'>
          <div>
            <img src={homeImages[3]} className='img04'/>
          </div>
          <div className='textbox04'>
            <p className='subtext04'>STEP 3</p>
            <p className='maintext04'>게임으로 실전처럼!</p>
            <div className='context04'>
              <p></p>
            </div>
          </div>
        </div>
    <a href="#section05"><span></span>Scroll</a>
  </section>
  <section id="section05" class="demo">
    <h1>Scroll Down Button #5</h1>
    <a href="#section06"><span></span>Scroll</a>
  </section>
  <section id="section06" class="demo">
    <h1>Scroll Down Button #6</h1>
    <a href="#thanks"><span></span>Scroll</a>
  </section>
  <section id="thanks">
    <div>
      <h2>Thanks!</h2>
      <p><a href="https://www.nxworld.net/css-scroll-down-button.html" target="_parent">&lt; Back To Article</a></p>
    </div>
  </section>

</div>
  )
}

export default HomeScroll
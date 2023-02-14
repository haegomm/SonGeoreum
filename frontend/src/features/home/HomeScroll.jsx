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
          <div className='textbox02'>
            <p className='subtext02'>STEP 1</p>
            <p className='maintext02'>수어도 한 걸음부터!</p>
          </div>
          <div>
            {/* <img src={homeImages[0]} className='img01'/> */}
          </div>
        </div>
    <a href="#section03"><span></span>Scroll</a>
  </section>
  <section id="section03" class="demo">
    <h1>Scroll Down Button #3</h1>
    <a href="#section04"><span></span>Scroll</a>
  </section>
  <section id="section04" class="demo">
    <h1>Scroll Down Button #4</h1>
    <a href="#section05"><span></span>Scroll</a>
  </section>
  <section id="section05" class="demo">
    <h1>Scroll Down Button #5</h1>
    <a href="#section06"><span></span>Scroll</a>
  </section>
  <section id="section06" class="demo">
    <h1>Scroll Down Button #6</h1>
    <a href="#section07"><span></span>Scroll</a>
  </section>
  <section id="section07" class="demo">
    <h1>Scroll Down Button #7</h1>
    <a href="#section08"><span></span><span></span><span></span>Scroll</a>
  </section>
  <section id="section08" class="demo">
    <h1>Scroll Down Button #8</h1>
    <a href="#section09"><span></span>Scroll</a>
  </section>
  <section id="section09" class="demo">
    <h1>Scroll Down Button #9</h1>
    <a href="#section10"><span></span>Scroll</a>
  </section>
  <section id="section10" class="demo">
    <h1>Scroll Down Button #10</h1>
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
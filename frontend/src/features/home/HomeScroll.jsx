import React, { useRef, useEffect, useCallback } from 'react'
import './HomeScroll.scss'
import $ from "jquery";
// import { useScrollFadeIn } from '@/hooks';

import homeImages from '../../assets/home/homeImage';
import { useNavigate } from 'react-router-dom';

function HomeScroll() {
  const navigate = useNavigate();
  
  // $(function() {
  //   $('a[href*=#]').on('click', function(e) {
  //     e.preventDefault();
  //     $('.homeScrollContainer').animate({ scrollTop: $($(this).attr('href')).offset().top}, 500, 'linear');
  //   });
  // });



  return (
    <div className='homeScrollContainer'>

      <section id="section01" class="demo">
        <div className='container01'>
          <div className='textbox01'>
            <p className='subtext01'>당신과 함께하는 첫 걸음,</p>
            <p className='maintext01'>손:걸음</p>
            <a href="#section02" id='scrolla'><span>시작해볼까요?</span></a>
          </div>
          <div>
            <img src={homeImages[0]} className='img01'/>
          </div>
        </div>
    {/* <h1>Scroll Down Button #1</h1> */}
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
          <p>자모음 표현부터</p>
          <p>실용적인 일상 회화 한마디까지</p>
          <a href='/study'>바로가기</a>
        </div>
      </div>
    </div>
    <a href="#section03" id='scrolla'><span></span>STEP 2</a>
  </section>
  <section id="section03" class="demo">
    {/* <h1>Scroll Down Button #3</h1> */}
    <div className='container03'>
          <div className='textbox03'>
            <p className='subtext03'>STEP 2</p>
            <p className='maintext03'>모션인식으로 재미있게!</p>
            <div className='context03'>
              <p>놀면서 쌓는 경험치!</p>
              <p>머신러닝 기반 모션인식 테스트</p>
              <a href='/study'>바로가기</a>
            </div>
          </div>
          <div>
            <img src={homeImages[2]} className='img03'/>
          </div>
        </div>
    <a href="#section04" id='scrolla'><span></span>STEP 3</a>
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
              <p>얼굴을 마주하고 수어로 표현해요</p>
              <p>손으로 말해요 게임</p>
              <a href='/game'>바로가기</a>
            </div>
          </div>
        </div>
    <a href="#section05" id='scrolla'><span></span>공존으로 가는 한걸음</a>
  </section>
  <section id="section05" class="demo">
    <div className='container05'>
      <div className='textbox05'>
        <p className='maintext05'>함께 걸어요!</p>
        <div className='context05'>
          <p>우리 얘기 여기에 적기</p>
        </div>
      </div>
      <div>
        <img src={homeImages[0]} className='img01'/>
      </div>
    </div>
  </section>
</div>
  )
}

export default HomeScroll
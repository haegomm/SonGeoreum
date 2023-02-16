import React from 'react'
import './HomeScroll.scss'
import useScrollFadeIn from "./useScrollFadeIn";

import homeImages from '../../assets/home/homeImage';
import logoImages from '../../assets/logo/logoImage';
// import { useNavigate } from 'react-router-dom';

function HomeScroll() {
  // const navigate = useNavigate();
  const animatedItem = {
    0: useScrollFadeIn('up', 1, 0),
    1: useScrollFadeIn('up', 1, 0.2),
    2: useScrollFadeIn('up', 1, 0.3),
  };

  return (
    <div>
      <section id="section01" className="demo">
        <div className='container01'>
          <div className='textbox01'>
            <p className='subtext01'>당신과 함께하는 첫 걸음,</p>
            <p className='maintext01'>손:걸음</p>
          </div>
          <div>
            <img src={homeImages[0]} alt='' className='img01'/>
          </div>
          <a href="#section02" id='scrolla'>시작해볼까요?</a>
        </div>
    </section>
  <section id="section02" className="demo">
    {/* <h1>Scroll Down Button #2</h1> */}
    <div className='container02'>
      <div {...animatedItem[0]}>
        <img src={homeImages[1]} alt='' className='img02'/>
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
      <a href="#section03" id='scrolla'>STEP 2</a>
    </div>
  </section>
  <section id="section03" className="demo">
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
      <div {...animatedItem[1]}> 
        <img src={homeImages[2]} alt='' className='img03'/>
      </div>
      <a href="#section04" id='scrolla'>STEP 3</a>
    </div>
  </section>
  <section id="section04" className="demo">
    {/* <h1>Scroll Down Button #4</h1> */}
    <div className='container04'>
      <div {...animatedItem[1]}>
        <img src={homeImages[3]} alt='' className='img04'/>
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
      <a href="#section05" id='scrolla'>공존으로 가는 한걸음</a>
    </div>
  </section>
  <section id="section05" className="demo">
    <div className='container05'>
      <div className='textbox05'>
        <p className='maintext05'>함께 걸어요!</p>
        <div className='context05'>
          <p>'농인'이라는 단어를 알고 계신가요?</p>
          <p>'농인'은 청각을 사용하지 않는 이들을 칭하는 단어로, 흔히 '청각장애인'으로 알려져있는 사람들입니다.</p>
          <p>그들은 독자적인 문화와 언어체계를 구축하고 사회에 존재함에도 불구하고</p>
          <p>'장애'라는 이름으로 일축되어 사회에서 지워지곤 하는데요.</p>
          <br/>
          <p>손:걸음은, 농문화에 대한 사회 인식 개선을 위한 프로젝트입니다.</p>
          <p>거창한 대의는 없어도 괜찮아요! 그저 준비된 컨텐츠를 즐겨주세요.</p>
          <p>어느새 농인들의 불편함에 공감하고, 그들만의 문화에 관심을 갖는 스스로를 느낄 수 있을거에요.</p>
          <br/>
          <p>서로의 다름을 존중하고 모두가 더불어가는 사회를 지향합니다.</p>
          <p>지금 바로, 함께 한 걸음 내딛어볼까요?</p>
        </div>
      </div>
      <div {...animatedItem[0]}>
        <img src={logoImages[0]} alt='' className='logo01'/>
      </div>
      <a href="#section01" id='scrolla'>처음으로</a>
    </div>
  </section>
</div>
  )
}

export default HomeScroll
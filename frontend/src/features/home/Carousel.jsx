import React, { useEffect, useState } from 'react';
import carouselContents from './carouselContents';
import './Carousel.scss'

function Carousel() {
  const [viewingPage, setViewingPage] = useState(0)
  let slice = 0

  const onMoveLefttHandler = (e) => {
    // const current = viewingPage
    const current = slice
    console.log(current)
    if (current === 0) {
      // setViewingPage(4)
      slice = 4
    } else {
      // setViewingPage(current-1)
      slice = current - 1
    }
  }
    
  const onMoveRightHandler = (e) => {
    // const next = current
    // current = current + 1
    // setSlide(next, current);
    // const current = viewingPage
    const current = slice
    console.log(current)
    if (current === 4) {
      // setViewingPage(0)
      slice = 0
    } else {
      // setViewingPage(current+1)
      slice = current+1
    }
  }

  // useEffect(() => {
  //   setInterval(() => {onMoveRightHandler()}, 800)
  // }, [])

  // function setSlide(prev, next) {
  //   let slide = current
  //   if (next > total-1) {
  //     slide=0;
  //     current=0;
  //   } else if(next<0) {
  //     slide=total-1
  //     current=total-1
  //   }
  //   setViewingPage(next)
  //   setTimeout(function(){

  //   },800);
  // }


  // $(function(){
  //   $('.carousel-item').eq(0).addClass('active');
  //   var total = $('.carousel-item').length;
  //   var current = 0;
  //   $('#moveRight').on('click', function(){
  //     var next=current;
  //     current= current+1;
  //     setSlide(next, current);
  //   });
  //   $('#moveLeft').on('click', function(){
  //     var prev=current;
  //     current = current- 1;
  //     setSlide(prev, current);
  //   });
  //   function setSlide(prev, next){
  //     var slide= current;
  //     if(next>total-1){
  //      slide=0;
  //       current=0;
  //     }
  //     if(next<0){
  //       slide=total - 1;
  //       current=total - 1;
  //     }
  //            $('.carousel-item').eq(prev).removeClass('active');
  //            $('.carousel-item').eq(slide).addClass('active');
  //       setTimeout(function(){
  
  //       },800);
      
  
      
  //     console.log('current '+current);
  //     console.log('prev '+prev);
  //   }
  // });

  return (
    <div>
      <div className="carousel">
        <div className="carousel__nav">
          <span id="moveLeft" className="carousel__arrow">
          <svg className="carousel__icon" width="24" height="24" viewBox="0 0 24 24"  onClick={onMoveLefttHandler}>
          <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path>
          </svg>
          </span>
          <span id="moveRight" className="carousel__arrow">
          <svg className="carousel__icon"  width="24" height="24" viewBox="0 0 24 24" onClick={onMoveRightHandler}>
          <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
          </svg>    
          </span>
        </div>
        {carouselContents.map((carouselContent) => (
          <div className={carouselContent.idx===slice ? 'active' : `carousel-item-${carouselContent.idx}`}>
            <div className="carousel-item__image"><img src={carouselContent.imgUrl}/></div>
            <div className="carousel-item__info">
              <h2 className="carousel-item__subtitle">{carouselContent.subtitle}</h2>
              <h1 className="carousel-item__title">{carouselContent.title}</h1>
              <p className="carousel-item__description">{carouselContent.description}</p>
              <a href="#" className="carousel-item__btn">{carouselContent.button}</a>
            </div>
          </div>
        ))}
      </div>

      {/* <body>
      <div className="carousel">
        <div className="carousel__nav">
        <span id="moveLeft" className="carousel__arrow" onClick={onMoveLefttHandler}>
              <svg className="carousel__icon" width="24" height="24" viewBox="0 0 24 24">
          <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path>
      </svg>
          </span>
          <span id="moveRight" className="carousel__arrow" onClick={onMoveRightHandler}>
            <svg className="carousel__icon"  width="24" height="24" viewBox="0 0 24 24">
        <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
      </svg>    
          </span>
        </div>
        <div className="carousel-item carousel-item--1">
          <div className="carousel-item__image"></div>
          <div className="carousel-item__info">
            <div className="carousel-item__container">
            <h2 className="carousel-item__subtitle">The grand moment </h2>
            <h1 className="carousel-item__title">Le tour</h1>
            <p className="carousel-item__description">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
            <a href="#" className="carousel-item__btn">Explore the tour</a>
              </div>
          </div>
        </div>
        <div className="carousel-item carousel-item--2">
          <div className="carousel-item__image"></div>
          <div className="carousel-item__info">
            <div className="carousel-item__container">
            <h2 className="carousel-item__subtitle">The big window </h2>
            <h1 className="carousel-item__title">Minimal window</h1>
            <p className="carousel-item__description">Clear Glass Window With Brown and White Wooden Frame iste natus error sit voluptatem accusantium doloremque laudantium.</p>
            <a href="#" className="carousel-item__btn">Read the article</a>
              </div>
          </div>
        </div>
          <div className="carousel-item carousel-item--3">
          <div className="carousel-item__image"></div>
          <div className="carousel-item__info">
            <div className="carousel-item__container">
            <h2 className="carousel-item__subtitle">Tropical palms </h2>
            <h1 className="carousel-item__title">Palms</h1>
            <p className="carousel-item__description">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
            <a href="#" className="carousel-item__btn">Explore the palms</a>
              </div>
          </div>
        </div>
        
        <div className="carousel-item carousel-item--4">
          <div className="carousel-item__image"></div>
          <div className="carousel-item__info">
            <div className="carousel-item__container">
            <h2 className="carousel-item__subtitle">Beach </h2>
            <h1 className="carousel-item__title">The beach </h1>
            <p className="carousel-item__description">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
            <a href="#" className="carousel-item__btn">Explore the beach</a>
              </div>
          </div>
        </div>
        
      <div className="carousel-item carousel-item--5">
          <div className="carousel-item__image"></div>
          <div className="carousel-item__info">
            <div className="carousel-item__container">
            <h2 className="carousel-item__subtitle">The white building </h2>
            <h1 className="carousel-item__title">White building</h1>
            <p className="carousel-item__description">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.</p>
            <a href="#" className="carousel-item__btn">Read the article</a>
              </div>
          </div>
        </div>
        
      </div>
      </body> */}
    </div>
    
  )
}

export default Carousel
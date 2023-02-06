import React, {useEffect, useRef, useState } from "react";
import profileImages from "../../assets/profile/profileImages";
// import styles from "./sidebar.module.css";


const Sidebar = ({ width=280, children }) => {
  const [isOpen, setOpen] = useState(false);
  const [xPosition, setX] = useState(-width);
  const side = useRef();
  
  // button 클릭 시 토글
  const toggleMenu = () => {
    if (xPosition < 0) {
      setX(0);
      setOpen(true);
    } else {
      setX(-width);
      setOpen(false);
    }
  };
  
  // 사이드바 외부 클릭시 닫히는 함수
  const handleClose = async e => {
    let sideArea = side.current;
    let sideCildren = side.current.contains(e.target);
    if (isOpen && (!sideArea || !sideCildren)) {
      await setX(-width); 
      await setOpen(false);
    }
  }

  useEffect(()=> {
    window.addEventListener('click', handleClose);
    return () => {
      window.removeEventListener('click', handleClose);
    };
  })


  return (
    <div>
      <div ref={side} style={{ width: `${width}px`, height: '100%',  transform: `translatex(${-xPosition}px)`}}>
          <button onClick={() => toggleMenu()}>
            {isOpen ? 
            <span>X</span> : <img src={profileImages.profile2} alr="contact open button" />
            }
          </button>
        <div>{children}
          {/* <div>하이하이</div>
          <div>하이하이</div>
          <div>하이하이</div>
          <div>하이하이</div>
          <div>하이하이</div>
          <div>하이하이</div>
          <div>하이하이</div>
          <div>하이하이</div>
          <div>하이하이</div>
          <div>하이하이</div> */}
        </div>
      </div>
    </div>
  );
};


export default Sidebar;
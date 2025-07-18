// src/components/ScrollToTop.jsx
import React, { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import '../Style/ScrollToTop.css';


const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);


  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };


    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);


  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  return (
    visible && (
      <button className="scroll-to-top" onClick={scrollToTop} aria-label="Remonter">
        <FaArrowUp />
      </button>
    )
  );
};


export default ScrollToTop;


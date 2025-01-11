import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; 
import '../styles/headerReturn.css'; 

const HeaderReturn = () => {
  const navigate = useNavigate();

  return (
    <div className="header-return">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft /> 
      </button>
      <h1>ParaLlevar</h1>
    </div>
  );
};

export default HeaderReturn;

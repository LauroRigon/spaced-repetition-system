import React from 'react';
import './index.css';

const VerificationMessage = ({ show, handleClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className='verification-message'>
      <span>Por favor, verifique sua conta acessando seu email e seguindo as devidas instruções!</span>
      <a onClick={handleClose}><i className='close icon'></i></a>
    </div>
  )
}

export default VerificationMessage;

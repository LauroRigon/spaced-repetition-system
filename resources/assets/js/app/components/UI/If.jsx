import React from 'react'

const If = ({ test, children }) => {
  if(!test) {
    return null;
  }

  return children;
}

export default If;

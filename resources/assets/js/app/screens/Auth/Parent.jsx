import React from 'react';
import { Container } from 'semantic-ui-react';

const AuthParent = (props) => {
  return (
    <Container>
      {props.children}  {/* RENDER ROUTES NESTED TO THE COMPONENT IN Root.jsx */}
    </Container>
  );
}

export default AuthParent;

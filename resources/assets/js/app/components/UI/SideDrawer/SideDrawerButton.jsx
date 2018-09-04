import React from 'react';
import { Button } from 'semantic-ui-react';

const SideDrawerButton = ({ handleClick }) => {
  return (
    <div>
      <Button basic size='medium' icon='bars' onClick={handleClick}></Button>
      <span />
    </div>
  )
}

export default SideDrawerButton;

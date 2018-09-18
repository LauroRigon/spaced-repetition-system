import React from 'react';
import PropTypes from 'prop-types';
import { Header } from 'semantic-ui-react';
import AuthLogOutBtn from '../../Auth/LogOutBtn/LogOutBtn';
import './index.css';
import SideDrawerButton from '../SideDrawer/SideDrawerButton';

const AppHeader = ({ label, paddingLeft, handleSideDrawerClick }) => {

  return (
    <React.Fragment>
    <header>
      <Header style={{ paddingLeft: `${paddingLeft}px` }}>        
        <Header.Content>
          <SideDrawerButton handleClick={handleSideDrawerClick}/>
          {label}
        </Header.Content>        
          <AuthLogOutBtn />        
      </Header>
      {/* <VerificationMessage /> */}
    </header>
    
    </React.Fragment>
  )
}

AppHeader.propTypes = {
  label: PropTypes.string,
  handleSideDrawerClick: PropTypes.func
}

export default AppHeader;

import React from 'react';
import { Container, Grid, Dimmer, Transition } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from 'app/components/UI/Header';
import SideDrawer from '../../components/UI/SideDrawer/SideDrawer';
import VerificationMessage from '../../components/UI/VerificationMessage';

import { setIsSidebarOpen } from 'app/actions/ui';

class AppParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showVerificationMessage: false
    };

    this.openSidebar = this.openSidebar.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
    this.handleCloseVerificationMessage = this.handleCloseVerificationMessage.bind(this);
  }
  componentDidMount() {
    this.closeSidebar();
  }

  componentWillMount() {
    const showVerificationMessage = !this.props.user.is_verified;
    this.setState({ ...this.state, showVerificationMessage: showVerificationMessage });
  }

  openSidebar() {
    this.props.setIsSidebarOpen(true);
  }

  closeSidebar() {
    this.props.setIsSidebarOpen(false);
  }

  handleCloseVerificationMessage() {
    this.setState({...this.state, showVerificationMessage: false})
  }

  render() {
    const {
      children,
      isSidebarOpen,
      isMobile,
      user
    } = this.props;

    return (
      <div className="animated fadeIn">
        <Header handleSideDrawerClick={this.openSidebar} />
        <SideDrawer visible={!isMobile || isSidebarOpen} user={user} />
        <Dimmer active={isMobile && isSidebarOpen} onClick={this.closeSidebar} />

        <div className='container' style={{ transition: '.7s ease' }}>
          <VerificationMessage 
          show={this.state.showVerificationMessage} 
          handleClose={this.handleCloseVerificationMessage}
          handleRequestNewToken={this.handleSendNewVerificationLink}/>
          
          <div className='container-full-page'>
            
            {children}  {/* RENDER ROUTES NESTED TO THE COMPONENT IN Root.jsx */}
            
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isSidebarOpen: state.ui.isSidebarOpen,
    isMobile: state.ui.isMobile,
    user: state.user.account,
    authToken: state.user.authToken
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    setIsSidebarOpen,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AppParent);

import React from 'react';
import { Dimmer } from 'semantic-ui-react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Header from 'app/components/UI/Header';
import SideDrawer from '../../components/UI/SideDrawer/SideDrawer';
import VerificationMessage from '../../components/UI/VerificationMessage';
import ModalManager from 'app/components/UI/Modals/ModalManager';
import { setIsSidebarOpen } from 'app/actions/ui/settings';
import { checkSession } from 'app/actions/user';
import AppLoader from '../../components/UI/AppLoader';

class AppParent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      closedVerificationMessage: false
    };

    this.openSidebar = this.openSidebar.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
    this.handleCloseVerificationMessage = this.handleCloseVerificationMessage.bind(this);
  }
  componentDidMount() {
    this.closeSidebar();    
  }

  componentWillMount() {
    this.props.checkSession();

  }

  openSidebar() {
    this.props.setIsSidebarOpen(true);
  }

  closeSidebar() {
    this.props.setIsSidebarOpen(false);
  }

  handleCloseVerificationMessage() {
    this.setState({...this.state, closedVerificationMessage: true})
  }

  render() {
    const {
      children,
      isSidebarOpen,
      isMobile,
      user,
      appLoaded
    } = this.props;

    if(!appLoaded){
      //tela de loading apaarece se o state de isloaded na ui estiver false
      //o state é modificado na action de user quando a sessão é checada com sucesso
      return (<AppLoader />)
    }

    return (
      <div className="animated fadeIn">
        <ModalManager/>
        <Header handleSideDrawerClick={this.openSidebar} />
        <SideDrawer visible={!isMobile || isSidebarOpen} user={user} />
        <Dimmer active={isMobile && isSidebarOpen} onClick={this.closeSidebar} />

        <div className='container' style={{ transition: '.7s ease' }}>
          <VerificationMessage 
          is_verified={!this.props.user.is_verified}
          closed={this.state.closedVerificationMessage}
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
    isSidebarOpen: state.ui.settings.isSidebarOpen,
    isMobile: state.ui.settings.isMobile,
    user: state.user.account,
    authToken: state.user.authToken,
    appLoaded: state.ui.settings.isLoaded
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    setIsSidebarOpen,
    checkSession
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AppParent);

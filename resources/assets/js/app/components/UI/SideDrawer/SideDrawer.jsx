import React from 'react';
import PropTypes from 'prop-types';
import { Sidebar, Menu } from 'semantic-ui-react';
import Menus from '../Menus'
import './SideDrawer.css';
import UserBasic from '../UserBasic';

class SideDrawer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      user,
      visible
    } = this.props;

    return (
      <React.Fragment>
        <nav>
          <Sidebar
            as={Menu}
            animation='push'
            inverted
            vertical
            visible={visible}
          >
          <UserBasic name={user.name} imageSize='tiny' image='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTvT83UCHtgQS04O_4yDmzeY3I38Vx8FysUnAhOph2ik3QLSqpy'/>
            <Menus />
          </Sidebar>
        </nav>
      </React.Fragment>
    )
  }
}

SideDrawer.propTypes = {
  visible: PropTypes.bool,
  user: PropTypes.object
}

export default SideDrawer;

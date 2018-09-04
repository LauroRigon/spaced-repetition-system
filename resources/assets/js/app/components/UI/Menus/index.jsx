import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

const Menus = () => {
  return (
    <React.Fragment>
      <Menu.Item>
        <Icon name='home' />
        <NavLink to='/' activeClassName="selected"> Início </NavLink>
      </Menu.Item>
      <Menu.Item >
        <Icon name='home' />
        <NavLink to='/test' activeClassName="selected"> test </NavLink>
      </Menu.Item>
    </React.Fragment>
  )
}

export default Menus;

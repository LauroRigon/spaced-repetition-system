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
        <NavLink to='/decks' activeClassName="selected"> Decks </NavLink>
      </Menu.Item>
      <Menu.Item >
        <Icon name='cog' />
        <NavLink to='/decks-configs' activeClassName="selected"> Configurações </NavLink>
      </Menu.Item>
      <Menu.Item >
        <Icon name='users' />
        <NavLink to='/public-decks' activeClassName="selected"> Procurar decks públicos </NavLink>
      </Menu.Item>
    </React.Fragment>
  )
}

export default Menus;

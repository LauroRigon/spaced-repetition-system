import React from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { NavLink, Route, Link } from 'react-router-dom';

const Menus = () => {
  return (
    <React.Fragment>
      <MenuLink to='/' label='Início' icon='home' activeOnlyWhenExact={true}/>
      
      <MenuLink to='/decks' label='Decks' icon='clone'/>

      <MenuLink to='/cards-browser' label='Gerenciar cards' icon='browser'/>

      <MenuLink to='/decks-configs' label='Configurações de decks' icon='cog'/>

      <MenuLink to='/public-decks' label='Procurar decks públicos' icon='users'/>

    </React.Fragment>
  )
}

const MenuLink = ({ label, to, icon, activeOnlyWhenExact }) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    children={({ match }) => (
        <Link to={to} className={`link item ${match ? "active" : ""}`}>{label} <Icon name={icon} /></Link>
    )}
  />
);

export default Menus;

import React from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import Error404 from '../components/Errors/Error404/Error404';
import DeckConfigsContainer from './App/DeckConfigs/DeckConfigsContainer';
import DecksContainer from './App/Decks/DecksContainer';
import ViewDecksContainer from './App/Decks/View/ViewDecksContainer';
import Home from './App/Home';
import AppParent from './App/Parent';
import PublicDecksContainer from './App/PublicDecks/PublicDecksContainer';
import CardsBrowserContainer from './App/CardsBrowser';
import Login from './Auth/Login';
import AuthParent from './Auth/Parent';
import Register from './Auth/Register';
import PasswordRecovery from './Auth/PasswordRecovery/PasswordRecovery';
import OnlyGuestRoute from './routeRules/OnlyGuestRoute';
import PrivateRoute from './routeRules/PrivateRoute';
import ReviewController from './App/Review/ReviewController';

export default () => (
  <HashRouter>
    <Switch>

      {/* /auth/... routes */}
      <Route path='/auth' render={({ match }) => (
        <OnlyGuestRoute>
          <AuthParent>
            <Switch>
              <Route path={`${match.url}/login`} component={Login} />
              <Route path={`${match.url}/register`} component={Register} />
              <Route path={`${match.url}/password/recovery`} component={PasswordRecovery} />

              <Redirect from='*' to={`${match.url}/login`} />
            </Switch>
          </AuthParent>
        </OnlyGuestRoute>
      )} />


      {/* /app/... routes */}
      <Route path='/' render={({ match }) => (
        <PrivateRoute>
          <AppParent>
            <Switch>
              <Route path={`${match.url}/`} exact component={Home} />
              
              <Route path={`${match.url}decks`} exact component={DecksContainer} />
              <Route path={`${match.url}decks/:id`} exact component={(props) => (
                <ViewDecksContainer key={props.match.params.id} {...props}/>
              )} />
              <Route path={`${match.url}decks/:id/review`} exact component={ReviewController} />

              <Route path={`${match.url}decks-configs`} exact component={DeckConfigsContainer} />

              <Route path={`${match.url}public-decks`} exact component={(props) => (
                <PublicDecksContainer key={props.location.search} {...props}/>
              )} />
                
              <Route path={`${match.url}cards-browser`} exact component={CardsBrowserContainer} />

              <Route component={Error404}/>              
            </Switch>

          </AppParent>
        </PrivateRoute>
      )} />

    </Switch>
  </HashRouter>
);
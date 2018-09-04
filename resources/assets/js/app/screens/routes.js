import React from 'react';
import { Route, Switch, Redirect, HashRouter } from 'react-router-dom';
import AuthParent from './Auth/Parent';
import Login from './Auth/Login';
import AppParent from './App/Parent';
import Home from './App/Home';
import Register from './Auth/Register';
import PrivateRoute from './routeRules/PrivateRoute';
import OnlyGuestRoute from './routeRules/OnlyGuestRoute';
import PasswordRecovery from './Auth/PasswordRecovery/PasswordRecovery';
import Error404 from '../components/Errors/Error404/Error404';

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
              {/* <Route path={`${match.url}/password/recovery`} component={PasswordRecovery} /> */}

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
              <Route path={`${match.url}test`} component={Login} />
              <Route component={Error404}/>
              
            </Switch>

          </AppParent>
        </PrivateRoute>
      )} />

    </Switch>
  </HashRouter>
);
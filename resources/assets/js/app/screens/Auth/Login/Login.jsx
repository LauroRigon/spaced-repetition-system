import React from 'react';
import { Grid } from 'semantic-ui-react';
import AuthLogin from '../../../components/Auth/Login';

const Login = (props) => {
  return (
    <Grid.Column width={7}>
      <AuthLogin />
    </Grid.Column>

  );
}

export default Login;

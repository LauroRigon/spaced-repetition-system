import React from 'react'
import AuthRegister from '../../../components/Auth/Register/Register';
import { Grid } from 'semantic-ui-react';

const Register = () => {
  return (
    <Grid.Column width={6}>
      <AuthRegister />
    </Grid.Column>
  )
}

export default Register;

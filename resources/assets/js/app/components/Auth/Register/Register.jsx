import React, { Component } from 'react';
import { Form, Header, Segment, Button, Label, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setUserName, setEmail, setPassword, setPasswordConfirmation, submitRegistration } from './actions';

class AuthRegister extends Component {
  componentDidMount() {
    const { setEmail, emailOnLogin } = this.props;

    setEmail(emailOnLogin);
  }

  render() {
    const {
      form,
      isLoading,
      errors,

      setUserName,
      setEmail,
      setPassword,
      setPasswordConfirmation,
      submitRegistration
    } = this.props;

    return (
      <Grid columns={1}>
        <Grid.Row centered>
          <Grid.Column mobile={16} tablet={12} computer={7}>
            <Header as='h2' color='teal' textAlign='center'>
              Cadastro
            </Header>

            <Segment>
              <Form size='small'
                onSubmit={() => submitRegistration(form)}
                loading={isLoading}
              >
                <Form.Field>
                  <Form.Input label='Nome de usuário:' labelPosition='left' placeholder='Digite seu nome de usuário' type='text'
                    value={form.username}
                    onChange={e => setUserName(e.target.value)}
                  />
                  {(!errors.username) ? null : (
                    <Label basic color='red' pointing>
                      {errors.username.map(error => (<li key={error}>{error}</li>))}
                    </Label>
                  )}
                </Form.Field>

                <Form.Field>
                  <Form.Input label='E-mail:' placeholder='Digite seu endereço de e-mail' type='email'
                    value={form.email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  {(!errors.email) ? null : (
                    <Label basic color='red' pointing>
                      {errors.email.map(error => (<li key={error}>{error}</li>))}
                    </Label>
                  )}
                </Form.Field>

                <Form.Field>
                  <Form.Input label='Senha:' placeholder='Digite sua senha' type='password'
                    value={form.password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  {(!errors.password) ? null : (
                    <Label basic color='red' pointing>
                      {errors.password.map(error => (<li key={error}>{error}</li>))}
                    </Label>
                  )}
                </Form.Field>

                <Form.Field>
                  <Form.Input label='Confirme sua senha:' placeholder='Digite sua senha novamente' type='password'
                    value={form.password_confirmation}
                    onChange={e => setPasswordConfirmation(e.target.value)}
                  />
                  {(!errors.password_confirmation) ? null : (
                    <Label basic color='red' pointing>
                      {errors.password_confirmation.map(error => (<li key={error}>{error}</li>))}
                    </Label>
                  )}
                </Form.Field>
                <Button color='teal'>Cadastrar-se</Button>
              </Form>
            </Segment>
            <Segment textAlign='center'>
              Já é cadastrado? <Link to='/auth/login'>Entre na sua conta</Link>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  return {
    form: {
      username: state.auth.register.form.username,
      email: state.auth.register.form.email,
      password: state.auth.register.form.password,
      password_confirmation: state.auth.register.form.password_confirmation,
    },
    emailOnLogin: state.auth.login.email,
    isLoading: state.auth.register.isLoading,
    errors: state.auth.register.errors
  };
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    setUserName,
    setEmail,
    setPassword,
    setPasswordConfirmation,
    submitRegistration
  }, dispatch);

}

export default connect(mapStateToProps, mapDispatchToProps)(AuthRegister);

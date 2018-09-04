import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Header, Form, Segment, Button, Grid } from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';
import { setEmail, setPassword, setRemember, clearInputs, submitLogin } from './actions';

class AuthLogin extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.props.clearInputs()
  }

  handleSubmit() {
    const {
      email,
      password,
      remember,
    } = this.props;

    const data = { email, password, remember };
    this.props.submitLogin(data);
  }

  render() {
    const {
      email,
      password,
      remember,
      errors,
      isLoading,

      setEmail,
      setPassword,
      setRemember,
    } = this.props;



    return (
      <Grid columns={1}>
        <Grid.Row centered>
          <Grid.Column mobile={16} tablet={12} computer={7}>
            <Header as='h2' color='teal' textAlign='center'>
              Entrar em sua conta.
              </Header>
            <Form size='large'
              loading={isLoading}
              error={(errors.length) ? true : false}
              onSubmit={this.handleSubmit}
            >
              <Segment>
                <Form.Input icon='user' iconPosition='left' placeholder='Digite seu e-mail' type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
                <Form.Input icon='lock' iconPosition='left' placeholder='Digite sua senha' type='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />

                <Grid.Row>
                  <Grid.Column textAlign='right'>
                      <Link to='/auth/password/recovery' style={{float: 'right', marginBottom: '8px'}}>Esqueci minha senha</Link>
                  </Grid.Column>
                </Grid.Row>

                <Button color='teal' size='large' fluid>
                  Entrar
                  </Button>
              </Segment>
              <Segment textAlign='center'>
                Ainda não é cadastrado? <Link to='/auth/register'>Inscreva-se</Link>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    email: state.auth.login.email,
    password: state.auth.login.password,
    remember: state.auth.login.remember,
    errors: state.auth.login.errors,
    isLoading: state.auth.login.isLoading,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    setEmail,
    setPassword,
    setRemember,
    clearInputs,
    submitLogin,
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthLogin));
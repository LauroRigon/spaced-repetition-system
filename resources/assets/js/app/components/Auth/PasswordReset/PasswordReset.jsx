import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Header, Segment, Button, Label } from 'semantic-ui-react';

class PasswordReset extends Component {
  render() {
    const {
      tokenValue,
      passwordValue,
      passwordConfirmValue,
      emailValue,
      isLoading,
      errors,

      handlePasswordChange,
      handlePasswordConfirmationChange,
      handleTokenChange,
      onSubmit
    } = this.props;

    return (

      <Segment>
        <Header as='h4' textAlign='left'>
          Informe seu código recebido em seu e-mail
        </Header>
        <Label color='teal' ribbon={true}>
          {emailValue}
        </Label>
        <Form size='small' onSubmit={onSubmit} loading={isLoading}>
          <Form.Field width={6}>
            <Form.Input label='Código:' placeholder='Código' type='text'
              value={tokenValue}
              onChange={e => handleTokenChange(e.target.value)}
            />
            {(!errors.token) ? null : (
              <Label basic color='red' pointing>
                {errors.token.map(error => (<li key={error}>{error}</li>))}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <Form.Input label='Nova senha:' placeholder='Digite sua nova senha' type='password'
              value={passwordValue}
              onChange={e => handlePasswordChange(e.target.value)}
            />
            {(!errors.password) ? null : (
              <Label basic color='red' pointing>
                {errors.password.map(error => (<li key={error}>{error}</li>))}
              </Label>
            )}
          </Form.Field>

          <Form.Field>
            <Form.Input label='Confirme sua nova senha:' placeholder='Digite sua nova senha novamente' type='password'
              value={passwordConfirmValue}
              onChange={e => handlePasswordConfirmationChange(e.target.value)}
            />
          </Form.Field>
          <Button color='teal'>Continuar</Button>
        </Form>
      </Segment>

    )
  }
}

PasswordReset.propTypes = {
  tokenValue: PropTypes.string.isRequired,
  passwordValue: PropTypes.string.isRequired,
  passwordConfirmationValue: PropTypes.string.isRequired,
  emailValue: PropTypes.string.isRequired,
  handleTokenChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  handlePasswordConfirmationChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  errors: PropTypes.object
}

export default PasswordReset;
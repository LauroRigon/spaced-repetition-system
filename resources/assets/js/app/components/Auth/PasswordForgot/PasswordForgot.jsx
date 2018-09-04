import React, { Component } from 'react';
import PropTypes from 'prop-types'

import { Form, Header, Segment, Button } from 'semantic-ui-react';

class PasswordForgot extends Component {
  render() {
    const {
      emailValue,
      isLoading,

      handleEmailChange,
      onSubmit
    } = this.props;
    return (
        <Segment>
        <Header as='h4' textAlign='left'>
          Por favor informe seu email
        </Header>
          <Form size='small' onSubmit={onSubmit} loading={isLoading}>
            <Form.Field>
              <Form.Input label='E-mail:' placeholder='Digite seu endereço de e-mail' type='email' icon='mail' iconPosition='left'
                 value={emailValue}
                 onChange={e => handleEmailChange(e.target.value)}
              />
            </Form.Field>
            <Button color='teal'>Continuar</Button>
          </Form>
        </Segment>
    )
  }
}

PasswordForgot.propTypes = {
  emailValue: PropTypes.string.isRequired,
  handleEmailChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
}

export default PasswordForgot;
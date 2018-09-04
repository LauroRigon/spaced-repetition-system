import React from 'react';
import PasswordReset from '../../../components/Auth/PasswordReset/PasswordReset';
import './index.css';
import { Grid, Step } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import If from '../../../components/UI/If';
import PasswordForgot from '../../../components/Auth/PasswordForgot/PasswordForgot';

import {
  moveForward,
  moveBackward,
  setEmail,
  setLoading,
  submitRecoveryRequest,
  setToken,
  setPassword,
  setPasswordConfirmation,
  submitResetPassword,
  resetState
} from './actions';

class AuthPasswordRecovery extends React.Component {
  constructor(props) {
    super(props);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleRecoveryRequestSubmit = this.handleRecoveryRequestSubmit.bind(this);

    this.handleTokenChange = this.handleTokenChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordConfirmationChange = this.handlePasswordConfirmationChange.bind(this);
    this.handleResetSubmit = this.handleResetSubmit.bind(this);
  }

  componentDidMount() {
    this.props.resetState();
    this.props.setEmail(this.props.emailOnLogin);
  }

  /*
  * Parte do pedido
  */
  handleRecoveryRequestSubmit() {
    this.props.submitRecoveryRequest({ email: this.props.forms.email });
  }

  handleEmailChange(value) {
    this.props.setEmail(value);
  }
  /**##### */

  /*
  * Parte de reset
  */
  handleTokenChange(value) {
    this.props.setToken(value);
  }

  handlePasswordChange(value) {
    this.props.setPassword(value);
  }

  handlePasswordConfirmationChange(value) {
    this.props.setPasswordConfirmation(value);
  }

  handleResetSubmit() {
    this.props.submitResetPassword({ ...this.props.forms.reset, email: this.props.forms.email })
  }
  /*#######*/

  render() {
    const {
      steps,
      stepActivated,
      forms,
    } = this.props;

    return (
      <React.Fragment>

        <Step.Group id='steps-recovery' attached='top' fluid size='small' stackable='tablet' items={steps}/>
        <Grid columns={1}>
          <Grid.Row centered>
            <Grid.Column mobile={16} tablet={12} computer={7} className='respect-side-steps'>
              <If test={stepActivated == 'request'}>
                <PasswordForgot
                  handleEmailChange={this.handleEmailChange}
                  emailValue={forms.email}
                  onSubmit={this.handleRecoveryRequestSubmit}
                  isLoading={forms.isLoading}
                />
              </If>
              <If test={stepActivated == 'reset'}>
                <PasswordReset
                  errors={forms.errors}
                  tokenValue={forms.reset.token}
                  passwordValue={forms.reset.password}
                  passwordConfirmationValue={forms.reset.password_confirmation}
                  emailValue={forms.email}
                  handleTokenChange={this.handleTokenChange}
                  handlePasswordChange={this.handlePasswordChange}
                  handlePasswordConfirmationChange={this.handlePasswordConfirmationChange}
                  isLoading={forms.isLoading}
                  onSubmit={this.handleResetSubmit}
                />
              </If>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    steps: state.auth.passwordRecovery.steps,
    stepActivated: state.auth.passwordRecovery.stepActivated,
    forms: state.auth.passwordRecovery.forms,
    emailOnLogin: state.auth.login.email,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    moveForward,
    moveBackward,
    setEmail,
    setLoading,
    submitRecoveryRequest,
    setToken,
    setPassword,
    setPasswordConfirmation,
    submitResetPassword,
    resetState
  }, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthPasswordRecovery));

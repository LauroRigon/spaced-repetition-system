import React, { Component } from 'react'
import { Grid, Menu, Header, Segment } from 'semantic-ui-react';
import ChangePasswordForm from '../../../components/Account/ChangePassword/Form';
import { toastr } from 'react-redux-toastr'
import api from 'app/services/api'

class AccountContainer extends Component {
  constructor(props) {
    super(props)

    this.initialState = {
      currentPassword: '',
      password: '',
      password_confirmation: '',
      errors: [],
      isSubmting: false
    }

    this.state = this.initialState

    this.handleCurrentChange = this.handleCurrentChange.bind(this)
    this.handleNewChange = this.handleNewChange.bind(this)
    this.handleConfirmationChange = this.handleConfirmationChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  setIsSubmting (value) {
    this.setState({ ...this.state, isSubmting:  value})    
  }

  setErrors (errors) {
    this.setState({ ...this.state, errors:  errors})
  }

  resetState () {
    this.setState(this.initialState)
  }

  handleCurrentChange (value) {
    this.setState({ ...this.state, currentPassword: value })
  }

  handleNewChange (value) {
    this.setState({ ...this.state, password: value })
  }

  handleConfirmationChange (value) {
    this.setState({ ...this.state, password_confirmation: value })
  }

  handleSubmit () {
    const {
      currentPassword,
      password,
      password_confirmation,
    } = this.state

    const data = { currentPassword, password_confirmation, password }
    this.setIsSubmting(true)
    api.put('changePassword', data)
      .then((response) => {
        this.setIsSubmting(false)
        toastr.success('Tudo certo!', response.data.message)
        this.resetState()
      })
      .catch(({ response }) => {
        this.setIsSubmting(false)
        this.setErrors(response.data.errors)
      })
  }

  render() {
    return (
      <Grid padded='vertically' stackable>
        <Header as='h2' attached='top'>
          Sua conta
        </Header>
        <Grid.Row columns={1} >
          <Grid.Column padded='horizontally' width={4}>
            <Menu pointing secondary>
              <Menu.Item name='Alterar senha' active/>
            </Menu>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column padded='horizontally' width={16}>
            <Segment> 
              <Grid>
                <Grid.Column computer={6} tablet={12} mobile={16}>
                  <ChangePasswordForm 
                    currentPasswordValue={this.state.currentPassword}
                    newPasswordValue={this.state.password}
                    confirmationValue={this.state.password_confirmation}
                    handleCurrentPasswordChange={this.handleCurrentChange}
                    handleNewPasswordChange={this.handleNewChange}
                    handleConfirmationChange={this.handleConfirmationChange}
                    handleSubmit={this.handleSubmit}
                    loading={this.state.isSubmting}
                    errors={this.state.errors}
                  />
                </Grid.Column>
              </Grid>
              
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

export default AccountContainer

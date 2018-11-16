import React from 'react'
import { Form, Button, Label } from 'semantic-ui-react';
import { labeledErrors } from 'app/services/helpers'

const ChangePasswordForm = ({
  currentPasswordValue, 
  newPasswordValue, 
  confirmationValue,
  handleCurrentPasswordChange,
  handleNewPasswordChange,
  handleConfirmationChange,
  handleSubmit,
  loading,
  errors
}) => {
  return (
    <React.Fragment>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Senha atual:</label>
          <input placeholder='Digite aqui...' type='password' value={currentPasswordValue} onChange={(e) => handleCurrentPasswordChange(e.target.value)}/>
          {labeledErrors(errors['currentPassword'])}  
        </Form.Field>
        <Form.Field>
          <label>Nova senha:</label>
          <input placeholder='Aqui...' type='password' value={newPasswordValue} onChange={(e) => handleNewPasswordChange(e.target.value)}/>
          {labeledErrors(errors['password'])}  
        </Form.Field>
        <Form.Field>
          <label>Nova senha novamente:</label>
          <input placeholder='E aqui...' type='password' value={confirmationValue} onChange={(e) => handleConfirmationChange(e.target.value)}/>
          {labeledErrors(errors['password_confirmation'])}  
        </Form.Field>
        <Button type='submit' primary loading={loading} disabled={loading}>Salvar</Button>
      </Form>      
    </React.Fragment>
  )
}

export default ChangePasswordForm
import React from 'react'
import { Form, Button } from 'semantic-ui-react';

const ChangePasswordForm = ({
  currentPasswordValue, 
  newPasswordValue, 
  confirmationValue,
  handleCurrentPasswordChange,
  handleNewPasswordChange,
  handleConfirmationChange,
  handleSubmit,
  loading
}) => {
  return (
    <React.Fragment>
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Senha atual:</label>
          <input placeholder='Digite aqui...' value={currentPasswordValue} onChange={(e) => handleCurrentPasswordChange(e.target.value)}/>
        </Form.Field>
        <Form.Field>
          <label>Nova senha:</label>
          <input placeholder='Aqui...' value={newPasswordValue} onChange={(e) => handleNewPasswordChange(e.target.value)}/>
        </Form.Field>
        <Form.Field>
          <label>Nova senha novamente:</label>
          <input placeholder='E aqui...' value={confirmationValue} onChange={(e) => handleConfirmationChange(e.target.value)}/>
        </Form.Field>
        <Button type='submit' primary loading={loading} disabled={loading}>Salvar</Button>
      </Form>      
    </React.Fragment>
  )
}

export default ChangePasswordForm
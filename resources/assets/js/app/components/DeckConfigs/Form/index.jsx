import React from 'react'
import PropTypes from 'prop-types'
import { labeledErrors } from 'app/services/helpers'
import throttle from 'lodash/throttle';

import {
  Header,
  Form,
  Input,
  Segment,
  Button,
  Icon,
  Checkbox
} from 'semantic-ui-react'

const DeckConfigsForm = props => {
  const {
    icon,
    header,
    buttonLabel = 'Enviar',
    buttonColor = 'green',
    loading,
    errors,
    nameValue,
    handleNameChange,
    newCardsDayValue,
    handlenewCardsDayChange,
    autoPlayMediaValue,
    handleAutoPlayMediaChange,
    onSubmit
  } = props

  return (
    <React.Fragment>
      <Segment>
        <Header icon={icon} content={header} />
        <Form onSubmit={onSubmit} loading={loading}>
          <Form.Field width={16} required>
            <label>Nome da configuração: </label>
            <Input
              type='text'
              value={nameValue}
              onChange={e => handleNameChange(e.target.value)}
            />
            {labeledErrors(errors.name)}
          </Form.Field>

          <Form.Field width={8} required>
            <label>Novos cards por dia: </label>
            <Input
              type='number'
              value={newCardsDayValue}
              onChange={e => handlenewCardsDayChange(e.target.value)}
              placeholder='Ex: 30'
            />
            {labeledErrors(errors.new_cards_day)}
          </Form.Field>

          <Form.Field>
            <Checkbox label='Tocar automaticamente mídias' toggle checked={autoPlayMediaValue} onChange={() => handleAutoPlayMediaChange()}/>
          </Form.Field>

          <Button color={buttonColor} icon labelPosition='left' disabled={loading}>
            <Icon name='check' />{buttonLabel}
          </Button>
        </Form>
      </Segment>
    </React.Fragment>
  )
}

DeckConfigsForm.propTypes = {}

export default DeckConfigsForm

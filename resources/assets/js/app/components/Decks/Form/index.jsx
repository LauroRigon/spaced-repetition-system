import React from 'react'
import PropTypes from 'prop-types'
import { labeledErrors } from 'app/services/helpers'
import If from 'app/components/UI/If'
import {
  Header,
  Form,
  Input,
  Segment,
  Button,
  Icon,
  TextArea,
  Checkbox,
  Dropdown
} from 'semantic-ui-react'

const DecksForm = props => {
  const {
    isPublicField,
    icon,
    header,
    buttonLabel = 'Enviar',
    loading,
    errors,
    nameValue,
    handleNameChange,
    descValue,
    handleDescChange,
    folderValue,
    handleFolderChange,
    configValue,
    handleConfigChange,
    isPublicValue,
    handleIsPublicChange,
    onSubmit,
    configList,
    
  } = props
  console.log(configValue)
  return (
    <React.Fragment>
      <Segment>
        <Header icon={icon} content={header} />
        <Form onSubmit={onSubmit} loading={loading}>
          <Form.Field width={16} required>
            <label>Nome do deck: </label>
            <Input
              type='text'
              value={nameValue}
              onChange={e => handleNameChange(e.target.value)}
            />
            {labeledErrors(errors.name)}
          </Form.Field>

          <Form.Field width={6}>
            <label>Pasta: </label>
            <Input
              type='text'
              value={folderValue}
              onChange={e => handleFolderChange(e.target.value)}
              placeholder='Ex: Inglês'
            />
            {labeledErrors(errors.folder)}
          </Form.Field>

          <Form.Field width={5}>
            <label>Configuração: </label>
            <Dropdown value={configValue} selection onChange={(e, {value}) => handleConfigChange(value)} options={renderConfigsToDropdown(configList)}/>

          </Form.Field>

          <If test={isPublicField}>
            <Form.Field>
              <Checkbox
                label='Deck público'
                toggle
                checked={isPublicValue}
                onChange={() => handleIsPublicChange()}
              />
            </Form.Field>
          </If>

          <Form.Field
            width={16}
            control={TextArea}
            label='Descrição:'
            value={descValue}
            onChange={e => handleDescChange(e.target.value)}
          >
            {labeledErrors(errors.description)}
          </Form.Field>

          <Button positive icon labelPosition='left' disabled={loading}>
            <Icon name='check' />{buttonLabel}
          </Button>
        </Form>
      </Segment>
    </React.Fragment>
  )
}

function renderConfigsToDropdown(configs) {
  var options = []
  options = configs.map((conf, index) => {
    return { text: conf.name, value: conf.id }
  })
  options.unshift({text: 'Padrão', value: 0})
  return options
}

export default DecksForm

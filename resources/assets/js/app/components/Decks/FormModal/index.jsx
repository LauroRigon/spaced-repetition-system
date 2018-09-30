import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm } from 'redux-form'
import If from 'app/components/UI/If'
import { Header, Form, Segment, Button, Icon, Modal } from 'semantic-ui-react'
import LabelAndInput from '../../UI/Inputs/LabelAndInput'
import LabelAndSelect from '../../UI/Inputs/LabelAndSelect'
import LabelAndCheckbox from '../../UI/Inputs/LabelAndCheckbox'
import LabelAndTextarea from '../../UI/Inputs/LabelAndTextarea'

class DecksFormModal extends Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    this.props.initialize(this.props.initialValues)
  }

  render () {
    const {
      modalOpen,
      handleModalClose,
      isEdit,
      icon,
      header,
      buttonLabel = 'Enviar',
      loading,
      onSubmit,
      configList
    } = this.props
    const { handleSubmit } = this.props

    return (
      <React.Fragment>
        <Modal
          open={modalOpen}
          onClose={handleModalClose}
          size='small'
          closeIcon='close'
          className='animated zoomIn'
        >
          <Modal.Content>
            <Segment>
              <Header icon={icon} content={header} />
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name='name'
                  component={LabelAndInput}
                  width={7}
                  required
                  label='Nome do deck:'
                  type='text'
                  placeholder='Nome do seu deck'
                />

                <Field
                  name='folder'
                  component={LabelAndInput}
                  width={6}
                  label='Pasta:'
                  type='text'
                  placeholder='Ex: Inglês'
                />

                <Field
                  name='deck_config_id'
                  component={LabelAndSelect}
                  width={5}
                  label='Configuração:'
                  options={this.renderConfigsToDropdown(configList)}
                  defaultValue={0}
                />

                <If test={isEdit}>
                  <Field
                    name='is_public'
                    component={LabelAndCheckbox}
                    toggle
                    label='Deck público'
                  />
                </If>

                <Field
                  name='description'
                  component={LabelAndTextarea}
                  rows={5}
                  placeholder='Descrição do seu deck'
                />

                <Button positive icon labelPosition='left' disabled={loading}>
                  <Icon name='check' />{buttonLabel}
                </Button>
              </Form>

            </Segment>
          </Modal.Content>
        </Modal>
      </React.Fragment>
    )
  }

  renderConfigsToDropdown (configs) {
    var options = []
    options = configs.map((conf, index) => {
      return { text: conf.name, value: conf.id }
    })
    options.unshift({ text: 'Padrão', value: 0 })
    return options
  }
}

export default reduxForm({
  form: 'deck',
  initialValues: {
    deck_config_id: 0,
    is_public: false,
    enableReinitialize: true
  }
})(DecksFormModal)

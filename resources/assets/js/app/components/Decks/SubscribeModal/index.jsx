import React, { Component } from 'react'
import { Modal, Header, Segment, Form, Button, Icon } from 'semantic-ui-react'
import { reduxForm, Field } from 'redux-form'
import LabelAndInput from '../../UI/Inputs/LabelAndInput';
import LabelAndSelect from '../../UI/Inputs/LabelAndSelect';
class SubscribeModal extends Component {

  componentDidMount() {
    // this.props.initialize({})
  }
  

  renderConfigsToDropdown () {
    const { configs } = this.props
    var options = []
    options = configs.map((conf, index) => {
      return { text: conf.name, value: conf.id }
    })
    options.unshift({ text: 'Padrão', value: 0 })
    return options
  }

  render () {
    const { handleSubmit, onSubmit } = this.props

    return (
      <Modal
        size='mini'
        closeIcon='close'
        open
        className='animated zoomIn'
        closeOnDimmerClick
        onClose={this.props.hideModal}
      >
        <Modal.Content>

            <Header content='Inscrever-se no deck' />
            <Form onSubmit={handleSubmit}>
              <Field
                name='folder'
                component={LabelAndInput}
                width={16}
                label='Pasta:'
                type='text'
                placeholder='Ex: Inglês'
              />

              <Field
                name='deck_config_id'
                component={LabelAndSelect}
                width={7}
                label='Configuração:'
                options={this.renderConfigsToDropdown()}
                defaultValue={0}
              />

              <Button positive icon basic labelPosition='left'>
                <Icon name='check' />Confirmar
              </Button>
            </Form>

        </Modal.Content>
      </Modal>
    )
  }
}

export default reduxForm({ form: 'subscribe', initialValues: {deck_config_id: 0} })(SubscribeModal)

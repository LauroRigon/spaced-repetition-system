import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { toastr } from 'react-redux-toastr'
import { Form, Modal, Header, Button } from 'semantic-ui-react'
import DropzoneInput from 'app/components/UI/Inputs/DropzoneInput'
import TextEditor from 'app/components/UI/Inputs/TextEditor'
import LabelAndSelect from '../../UI/Inputs/LabelAndSelect'
import api from 'app/services/api'

class CardsFormModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false
    }

    this.onSubmit = this.onSubmit.bind(this)

    this.handleRemoveFrontMidia = this.handleRemoveFrontMidia.bind(this)
    this.handleRemoveBackMidia = this.handleRemoveBackMidia.bind(this)
  }
  componentWillMount () {
    this.props.initialize({ deck_id: this.props.deck.id })
  }

  setLoading (value) {
    this.setState({ ...this.state, isLoading: value })
  }

  appendDataToForm (data) {
    var formData = new FormData()
    formData.append('deck_id', data.deck_id)
    formData.append('front_text', data.front_text)
    formData.append('back_text', data.back_text)
    if (data.front_medias) {
      data.front_medias.forEach((media, i) =>
        formData.append('front_medias[]', media)
      )
    }
    if (data.back_medias) {
      data.back_medias.forEach((media, i) =>
        formData.append('back_medias[]', media)
      )
    }

    return formData
  }

  onSubmit (data) {
    if(data.front_text.replace(/&nbsp;+/g, '').length <= 8) return toastr.warning('Atenção!', 'O primeiro campo é obrigatório!')
    this.setLoading(true)
    const formData = this.appendDataToForm(data)

    api.post('cards/', formData)
      .then(response => {
        toastr.success('Tudo certo!', 'Card adicionado com sucesso!')
        this.props.reset()
        this.forceUpdate()
        this.setLoading(false)
      })
      .catch(({ response }) => {
        toastr.error('Ocorreu um erro!', 'Erro!')
        console.log(response.data)
        this.setLoading(false)
      })
  }

  handleRemoveFrontMidia (file, i) {
    this.props.array.remove('front_medias', i)
  }

  handleRemoveBackMidia (file, i) {
    this.props.array.remove('back_medias', i)
  }

  render () {
    const { handleSubmit, deck, icon, header, closeOnDimmerClick } = this.props

    return (
      <Modal
        closeIcon='close'
        open
        className='animated zoomIn'
        onClose={this.props.hideModal}
        closeOnDimmerClick={closeOnDimmerClick}
      >
        <Modal.Content>
          {/* <Segment> */}
          <Header icon={icon} content={header} />
          {/* <Label as='a' color='blue' tag>
            {deck.name}
          </Label> */}
          <Form
            onSubmit={handleSubmit(this.onSubmit)}
            loading={this.state.isLoading}
          >
            <Field
              name='deck_id'
              label='Deck:'
              component={LabelAndSelect}
              options={[{ key: 0, text: deck.name, value: deck.id }]}
              width={4}
              disabled
              inline
            />
            <Field name='front_text' component={TextEditor} label='Frente:' />
            <Field
              name='front_medias'
              component={DropzoneInput}
              onRemove={this.handleRemoveFrontMidia}
              dropzone_props={{
                multiple: true,
                accept: ['image/*', 'audio/mp3'],
                maxSize: 2000000
              }}
            />

            <Field name='back_text' component={TextEditor} label='Verso:' />
            <Field
              name='back_medias'
              component={DropzoneInput}
              onRemove={this.handleRemoveBackMidia}
              dropzone_props={{
                multiple: true,
                accept: ['image/*', 'audio/mp3'],
                maxSize: 2000000
              }}
            />

            <Button primary> Criar </Button>
          </Form>
          {/* </Segment> */}
        </Modal.Content>
      </Modal>
    )
  }
}

export default reduxForm({
  form: 'card',
  destroyOnUnmount: false
})(CardsFormModal)

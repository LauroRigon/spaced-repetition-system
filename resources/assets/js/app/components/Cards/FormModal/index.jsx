import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { toastr } from 'react-redux-toastr'
import { Form, Modal, Header, Button, Segment, Label, Progress } from 'semantic-ui-react'
import If from '../../UI/If'
import DropzoneInput from 'app/components/UI/Inputs/DropzoneInput'
import LabelAndSelect from '../../UI/Inputs/LabelAndSelect'
import CardEditor from '../../UI/Inputs/CardEditor'
import api from 'app/services/api'

class CardsFormModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      uploadProgress: 0
    }

    this.onSubmit = this.onSubmit.bind(this)

    this.handleRemoveFrontMidia = this.handleRemoveFrontMidia.bind(this)
    this.handleRemoveBackMidia = this.handleRemoveBackMidia.bind(this)
  }
  componentWillMount () {
    if (this.props.isEdit) {
      this.props.initialize({
        deck_id: this.props.deck.id,
        front_text: this.props.cardToEdit.front_content.text,
        back_text: this.props.cardToEdit.back_content.text
      })
    } else {
      this.props.initialize({ deck_id: this.props.deck.id })
    }
  }

  setLoading (value) {
    this.setState({ ...this.state, isLoading: value })
  }

  setUploadProgress (value) {
    this.setState({ ...this.state, uploadProgress: value })
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

  parseFromFormData (formData) {
    return {
      deck_id: formData.get('deck_id'),
      front_text: formData.get('front_text'),
      back_text: formData.get('back_text')
    }
  }

  onSubmit (data) {
    if (!data.front_text || data.front_text.replace(/&nbsp;+/g, '').length < 8) { return toastr.warning('Atenção!', 'O primeiro campo é obrigatório!') }

    const { isEdit, cardToEdit } = this.props
    const type = isEdit ? 'put' : 'post'

    this.setLoading(true)
    const formData = this.appendDataToForm(data)
    var config = {
      onUploadProgress: (progressEvent) => {this.setUploadProgress(Math.round(progressEvent.loaded / progressEvent.total * 100))}
    }
    if (isEdit) {
      config['params'] = this.parseFromFormData(formData)
    }

    api
      [type](
        'cards' + (isEdit ? `/${cardToEdit.id}` : ''),
        formData,
        config
      )
      .then(response => {
        toastr.success(
          'Tudo certo!',
          `Card ${isEdit ? 'atualizado' : 'criado'} com sucesso!`
        )
        this.setUploadProgress(0)
        this.props.reset()
        this.setLoading(false)
        (this.props.onSubmitSuccess && this.props.onSubmitSuccess())
      })
  }

  handleRemoveFrontMidia (file, i) {
    this.props.array.remove('front_medias', i)
  }

  handleRemoveBackMidia (file, i) {
    this.props.array.remove('back_medias', i)
  }

  render () {
    const {
      handleSubmit,
      deck,
      icon,
      header,
      closeOnDimmerClick,
      cardToEdit,
      isEdit
    } = this.props

    return (
      <Modal
      size='large'
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
            <Segment padded stacked>
              <Label attached='top left' color='teal'>Verso</Label>
              <Field
                name='front_text'
                component={CardEditor}
                label='Frente:'
                initialValue={isEdit ? cardToEdit.front_content.text : ''}
              />
              <If test={!isEdit}>
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
              </If>
            </Segment>
            <Segment padded stacked>
              <Label attached='top left' color='teal'>Frente</Label>
            <Field
              name='back_text'
              component={CardEditor}
              label='Verso:'
              initialValue={
                isEdit && cardToEdit.back_content.text != ''
                  ? cardToEdit.back_content.text
                  : null
              }
            />
            <If test={!isEdit}>
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
            </If>
            </Segment>
            <If test={!!this.state.uploadProgress}>
              <Progress percent={this.state.uploadProgress} size='small' color='blue' indicating progress autoSuccess>
                  Enviando mídias
              </Progress>
            </If>
            <Button primary loading={this.state.isLoading} disabled={this.state.isLoading}> {isEdit ? 'Salvar' : 'Criar'} </Button>
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

import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import {
  setName,
  setNewCardsDay,
  toogleAutoPlayMedia,
  setAutoPlayMedia,
  submitForm,
  setModalOpen,
  setModalUpdateOpen,
  fetchDeckConfigList,
  submitDeleteRequest
} from './actions'
import DeckConfigsList from '../../../components/DeckConfigs/List'
import { Grid, Modal, Button, Icon, Confirm, Segment, Header } from 'semantic-ui-react'
import DeckConfigsForm from '../../../components/DeckConfigs/Form'

class DeckConfigsContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      configIdToUpdateOrDelete: null,
      confirmOpen: false
    }

    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
    this.handleModalOpen = this.handleModalOpen.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleDeleteConfig = this.handleDeleteConfig.bind(this)
    this.fechConfsAndCloseConfirm = this.fechConfsAndCloseConfirm.bind(this)
  }

  componentWillMount () {
    this.props.fetchDeckConfigList()
  }

  handleEditClick (conf) {
    this.putConfOnStore(conf)

    this.props.setModalUpdateOpen(true)
  }

  putConfOnStore (conf) {
    this.props.setName(conf.name)
    this.props.setNewCardsDay(conf.new_cards_day)
    this.props.setAutoPlayMedia(conf.auto_play_media)

    this.setState({ ...this.state, configIdToUpdateOrDelete: conf.id })
  }

  handleDeleteClick (conf) {
    this.setOpenConfirm(true, conf.id)
  }

  setOpenConfirm (value, confId = null) {
    this.setState({
      ...this.state,
      confirmOpen: value,
      configIdToUpdateOrDelete: confId
    })
  }

  handleDeleteConfig () {
    this.props.submitDeleteRequest(
      this.state.configIdToUpdateOrDelete,
      this.fechConfsAndCloseConfirm
    )
  }

  fechConfsAndCloseConfirm () {
    this.setOpenConfirm(false)
    this.props.fetchDeckConfigList()
  }

  handleModalOpen () {
    this.props.setModalOpen(true)
  }

  handleModalClose () {
    this.props.setModalOpen(false)
  }

  handleCreateSubmit () {
    this.props.submitForm(
      'post',
      this.props.form.data,
      this.props.fetchDeckConfigList
    )
  }

  handleUpdateSubmit () {
    this.props.submitForm(
      'put',
      this.props.form.data,
      this.props.fetchDeckConfigList,
      this.state.configIdToUpdateOrDelete
    )
  }

  render () {
    const { configs, ui, form } = this.props

    return (
      <React.Fragment>
        <Modal
          open={ui.modalOpen}
          onClose={this.handleModalClose}
          size='small'
          closeIcon='close'
          className='animated zoomIn'
        >
          <Modal.Content>
            <DeckConfigsForm
              icon='plus'
              header='Criar nova configuração'
              buttonLabel='Criar'
              loading={form.isLoading}
              errors={form.errors}
              nameValue={form.data.name}
              handleNameChange={this.props.setName}
              newCardsDayValue={form.data.new_cards_day}
              handlenewCardsDayChange={this.props.setNewCardsDay}
              autoPlayMediaValue={form.data.auto_play_media}
              handleAutoPlayMediaChange={this.props.toogleAutoPlayMedia}
              onSubmit={e => this.handleCreateSubmit()}
            />
          </Modal.Content>
        </Modal>

        <Modal
          open={ui.modalUpdateOpen}
          onClose={() => this.props.setModalUpdateOpen(false)}
          size='small'
          closeIcon='close'
          className='animated zoomIn'
        >
          <Modal.Content>
            <DeckConfigsForm
              icon='refresh'
              header='Atualizar configuração'
              buttonLabel='Salvar'
              buttonColor='yellow'
              loading={form.isLoading}
              errors={form.errors}
              nameValue={form.data.name}
              handleNameChange={this.props.setName}
              newCardsDayValue={form.data.new_cards_day}
              handlenewCardsDayChange={this.props.setNewCardsDay}
              autoPlayMediaValue={form.data.auto_play_media}
              handleAutoPlayMediaChange={this.props.toogleAutoPlayMedia}
              onSubmit={e => this.handleUpdateSubmit()}
            />
          </Modal.Content>
        </Modal>

        <Confirm
          className='animated zoomIn'
          content='Tem certeza que quer deletar essa configuração?'
          confirmButton='Sim'
          cancelButton='Não'
          open={this.state.confirmOpen}
          onCancel={() => this.setOpenConfirm(false)}
          onConfirm={e => this.handleDeleteConfig()}
        />

        <Grid padded='vertically'>
          <Grid.Row columns={1}>
            <Grid.Column padded='horizontally' width={16}>
              <Header as='h2' attached='top'>
                Suas configurações
              </Header>
              <Segment attached>
                <Button
                  icon
                  labelPosition='left'
                  primary
                  onClick={this.handleModalOpen}
                >
                  <Icon name='plus' /> Nova
                </Button>
                <DeckConfigsList
                  isLoading={ui.isFetching && !configs.length}
                  configsList={configs}
                  onEditClick={this.handleEditClick}
                  onDeleteClick={this.handleDeleteClick}
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    form: state.app.deckConfigs.form,
    ui: state.app.deckConfigs.ui,
    configs: state.app.deckConfigs.configList
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setName,
      setNewCardsDay,
      toogleAutoPlayMedia,
      setAutoPlayMedia,
      submitForm,
      setModalOpen,
      fetchDeckConfigList,
      setModalUpdateOpen,
      submitDeleteRequest
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(
  DeckConfigsContainer
)

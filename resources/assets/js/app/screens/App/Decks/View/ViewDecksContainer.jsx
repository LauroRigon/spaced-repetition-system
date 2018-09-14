import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { fetchDeck, sendDeleteDeck } from './actions'
import { Segment, Grid, Header, Button, Icon, Confirm, Modal } from 'semantic-ui-react'
import DeckView from '../../../../components/Decks/View'
import ViewActions from '../../../../components/Decks/View/ViewActions'

import {
  setName,
  setDesc,
  setFolder,
  setConfig,
  setIsPublic,
  toggleIsPublic,
  submitForm,
  setModalOpen,
} from '../actions'
import { fetchDeckConfigList } from '../../DeckConfigs/actions'
import DecksForm from '../../../../components/Decks/Form';

class ViewDecksContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openDeleteConfirm: false
    }

    this.closeDeleteConfirm = this.closeDeleteConfirm.bind(this)
    this.handleOpenDeleteConfirm = this.handleOpenDeleteConfirm.bind(this)
    this.handleDeleteDeck = this.handleDeleteDeck.bind(this)
    
    /*MODAL*/
    this.handleCreateModalOpen = this.handleCreateModalOpen.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleDescChange = this.handleDescChange.bind(this)
    this.handleFolderChange = this.handleFolderChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleFetchDeck = this.handleFetchDeck.bind(this)
  }

  componentWillMount () {
    this.props.fetchDeckConfigList()
    this.handleFetchDeck()
  }

  handleFetchDeck() {
    const deck_id = this.props.match.params.id
    const history = this.props.history

    this.props.fetchDeck(deck_id, history)
  }

  handleOpenDeleteConfirm () {
    this.setState({ ...this.state, openDeleteConfirm: true })
  }

  closeDeleteConfirm () {
    this.setState({ ...this.state, openDeleteConfirm: false })
  }

  handleDeleteDeck () {
    const deck_id = this.props.deck.id
    this.props.sendDeleteDeck(deck_id, this.props.history)
    this.closeDeleteConfirm()
  }

  /**
   * EDIT MODAL
   * */
  handleCreateModalOpen () {
    this.props.setModalOpen(true)
    this.handleNameChange(this.props.deck.name)
    this.handleDescChange(this.props.deck.description)
    this.handleFolderChange(this.props.deck.pivot.folder)
    this.props.setConfig(this.props.deck.pivot.deck_config_id)
    this.props.setIsPublic(this.props.deck.is_public)
  }

  handleModalClose () {
    this.props.setModalOpen(false)
  }

  handleNameChange (value) {
    this.props.setName(value)
  }

  handleDescChange (value) {
    this.props.setDesc(value)
  }

  handleFolderChange (value) {
    this.props.setFolder(value)
  }

  handleSubmit (method, data) {
    const deck_id = this.props.deck.id

    
    const onSuccessFetchAgain = this.handleFetchDeck
    this.props.submitForm(method.toLowerCase(), data, onSuccessFetchAgain, deck_id)
  }


  render () {
    const { deck, auth_user_id, form, ui, configList } = this.props

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
            <DecksForm
              isPublicField
              icon='refresh'
              header='Editar deck'
              buttonLabel='Atualizar'
              loading={form.isLoading}
              errors={form.errors}
              nameValue={form.data.name}
              handleNameChange={this.handleNameChange}
              descValue={form.data.description}
              handleDescChange={this.handleDescChange}
              folderValue={form.data.folder}
              handleFolderChange={this.handleFolderChange}

              configValue={form.data.deck_config_id}
              handleConfigChange={this.props.setConfig}
              configList={configList}

              isPublicValue={form.data.is_public}
              handleIsPublicChange={this.props.toggleIsPublic}
              onSubmit={e => this.handleSubmit('PUT', form.data)}
            />
          </Modal.Content>
        </Modal>

        <Grid columns={2} stackable padded='vertically'>
          <Grid.Column largeScreen={12} computer={12} tablet={11}>
            <DeckView deck={deck} />
          </Grid.Column>
          <Grid.Column largeScreen={4} computer={4} tablet={5}>
            <ViewActions
              authenticatedUserId={auth_user_id}
              deckCreatorId={deck.creator_id}
              openDeleteConfirm={this.state.openDeleteConfirm}
              handleDeleteDeck={this.handleDeleteDeck}
              handleOpenDeleteConfirm={this.handleOpenDeleteConfirm}
              closeDeleteConfirm={this.closeDeleteConfirm}
              handleOpenEditModal={this.handleCreateModalOpen}
            />
          </Grid.Column>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth_user_id: state.user.account.id,
    form: state.app.decks.form,
    ui: state.app.decks.ui,
    deck: state.app.decks.view.deck,
    configList: state.app.deckConfigs.configList
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchDeck,
      sendDeleteDeck,
      setName,
      setDesc,
      setFolder,
      setConfig,
      setIsPublic,
      toggleIsPublic,
      submitForm,
      setModalOpen,

      fetchDeckConfigList
    },
    dispatch
  )
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ViewDecksContainer)
)

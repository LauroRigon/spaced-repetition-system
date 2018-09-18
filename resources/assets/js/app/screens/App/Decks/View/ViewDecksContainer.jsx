import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { SubmissionError } from 'redux-form'
import { fetchDeck, sendDeleteDeck } from './actions'
import { Grid } from 'semantic-ui-react'
import DeckView from '../../../../components/Decks/View'
import ViewActions from '../../../../components/Decks/View/ViewActions'

import { submitForm, setModalOpen } from '../actions'
import { fetchDeckConfigList } from '../../DeckConfigs/actions'
import FormModal from '../../../../components/Decks/FormModal'
// import DecksFormModal from '../../../../components/Decks/FormModal';

class ViewDecksContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openDeleteConfirm: false
    }

    this.closeDeleteConfirm = this.closeDeleteConfirm.bind(this)
    this.handleOpenDeleteConfirm = this.handleOpenDeleteConfirm.bind(this)
    this.handleDeleteDeck = this.handleDeleteDeck.bind(this)

    /* MODAL */
    this.handleEditModalOpen = this.handleEditModalOpen.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleFetchDeck = this.handleFetchDeck.bind(this)
  }

  componentWillMount () {
    this.props.fetchDeckConfigList()
    this.handleFetchDeck()
  }

  handleFetchDeck () {
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
  handleEditModalOpen () {
    this.props.setModalOpen(true)
  }

  handleModalClose () {
    this.props.setModalOpen(false)
  }

  handleSubmit (values) {
    const deck_id = this.props.deck.id
    const onSuccessFetchAgain = this.handleFetchDeck
    this.props.submitForm('put', values, onSuccessFetchAgain, deck_id)
  }

  render () {
    const { deck, auth_user_id, ui, configList } = this.props
    const initialFormValues = {
      name: deck.name,
      description: deck.description,
      folder: deck.pivot && deck.pivot.folder,
      deck_config_id: deck.pivot && deck.pivot.deck_config_id,
      is_public: deck.is_public
    }

    //só renderiza o form quando tiver deck fetchado pra q o form inicialize com os dados corretos!
    const renderFormModal = !Object.keys(deck).length ? null : (
      <FormModal
        modalOpen={ui.modalOpen}
        handleModalClose={this.handleModalClose}
        isEdit
        initialValues={initialFormValues}
        icon='refresh'
        header='Editar deck'
        buttonLabel='Atualizar'
        loading={ui.isSubmitting}
        configList={configList}
        onSubmit={this.handleSubmit}
      />
    )
    return (
      <React.Fragment>
        {renderFormModal}
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
              handleOpenEditModal={this.handleEditModalOpen}
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

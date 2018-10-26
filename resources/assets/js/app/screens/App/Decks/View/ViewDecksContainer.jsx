import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchDeck, sendDeleteDeck, subscribeToDeck, unSubscribe, setDeck } from './actions'
import { Grid } from 'semantic-ui-react'
import DeckView from '../../../../components/Decks/View'
import ViewActions from '../../../../components/Decks/View/ViewActions'

import { submitForm, setModalOpen } from '../actions'
import { fetchDeckConfigList } from '../../DeckConfigs/actions'
import { showModal, hideModal } from 'app/actions/ui/modals'

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

    this.handleAddCardsClick = this.handleAddCardsClick.bind(this)
    this.onCloseAddCardModal = this.onCloseAddCardModal.bind(this)

    this.handleSubscribeClick = this.handleSubscribeClick.bind(this)
    this.handleSubscribeSubmit = this.handleSubscribeSubmit.bind(this)
    this.handleUnsubscribeClick = this.handleUnsubscribeClick.bind(this)
  }

  componentWillUnmount() {
    this.props.setDeck({})
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


  /**
   * Add card
   */
  handleAddCardsClick () {
    this.props.showModal('CardsFormModal', {icon: 'plus', header: 'Adicionar card', deck: this.props.deck, closeOnDimmerClick: false, onClose: this.onCloseAddCardModal})
  }

  onCloseAddCardModal () {
    this.handleFetchDeck()
  }
  /**
   * Subscribe
   */
  handleSubscribeClick() {
    const {
      deck,
      configList
    } = this.props

    this.props.showModal('SubscribeModal', {deck: deck, configs: configList, onSubmit: this.handleSubscribeSubmit})
  }

  handleSubscribeSubmit(values) {
    this.props.subscribeToDeck(this.props.deck.id, values)
    this.props.hideModal()
  }

  handleUnsubscribeClick() {
    this.props.unSubscribe(this.props.deck.id, this.props.history)
  }

  render () {
    const { deck, auth_user, ui, configList } = this.props
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
              authenticatedUser={auth_user}
              deck={deck}
              openDeleteConfirm={this.state.openDeleteConfirm}
              handleDeleteDeck={this.handleDeleteDeck}
              handleOpenDeleteConfirm={this.handleOpenDeleteConfirm}
              closeDeleteConfirm={this.closeDeleteConfirm}
              handleOpenEditModal={this.handleEditModalOpen}
              handleOpenAddCardsModal={this.handleAddCardsClick}
              handleOpenSubscribeModal={this.handleSubscribeClick}
              handleOnSubmitSubscribe={this.handleSubscribeSubmit}
              handleUnsubscribeClick={this.handleUnsubscribeClick}
            />
          </Grid.Column>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth_user: state.user.account,
    ui: state.app.decks.ui,
    deck: state.app.decks.view.deck,
    configList: state.app.deckConfigs.configList
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchDeck,
      setDeck,
      sendDeleteDeck,
      submitForm,
      setModalOpen,

      fetchDeckConfigList,

      showModal,
      hideModal,

      subscribeToDeck,
      unSubscribe,
    },
    dispatch
  )
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ViewDecksContainer)
)

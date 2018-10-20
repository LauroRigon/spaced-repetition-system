import React, { Component } from 'react'
import { Grid, Header, Segment, Confirm } from 'semantic-ui-react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import FilterForm from '../../../components/CardsBrowser/FilterForm'
import CardList from '../../../components/CardsBrowser/List/CardList'

import { showModal, hideModal } from 'app/actions/ui/modals'
import { fetchDeckList } from '../Decks/actions'
import { fetchCards, deleteCard, suspendCard, unsuspendCard } from './actions'

class CardsBrowserContainer extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cardIdToDelete: 0,
      confirmOpen: false
    }

    this.onSubmitSearch = this.onSubmitSearch.bind(this)
    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleSuspendClick = this.handleSuspendClick.bind(this)
    this.handleUnsuspendClick = this.handleUnsuspendClick.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
    this.handleDeleteCard = this.handleDeleteCard.bind(this)
  }

  componentWillMount () {
    this.props.fetchDeckList()
    this.props.fetchCards()
  }

  onSubmitSearch (filter) {
    this.props.fetchCards(filter)
  }

  handleEditClick (card) {
    this.props.showModal('CardsFormModal', {
      icon: 'edit',
      header: 'Editar card',
      deck: card.deck,
      closeOnDimmerClick: false,
      isEdit: true,
      cardToEdit: card,
      onSubmitSuccess: () => {this.props.hideModal('CardsFormModal'); this.props.fetchCards({})}
    })
  }

  handleSuspendClick (card) {
    this.props.suspendCard(card.id, () => this.props.fetchCards())
  }

  handleUnsuspendClick (card) {
    this.props.unsuspendCard(card.id, () => this.props.fetchCards())
  }

  handleDeleteClick (card) {
    this.setOpenConfirm(true, card.id)    
  }

  handleDeleteCard () {
    this.props.deleteCard(this.state.cardIdToDelete, () => {this.props.fetchCards(); this.setOpenConfirm(false)})
  }

  setOpenConfirm (value= null, card_id = 0) {
    this.setState({
      ...this.state,
      confirmOpen: value,
      cardIdToDelete: card_id
    })
  }

  render () {
    const {
      cardList,
      isFetchingCards,
      isFetchingDecks,

      deckList
    } = this.props

    return (
      <Grid padded='vertically'>
        <Confirm
          className='animated zoomIn'
          content='Tem certeza que quer deletar esse card?'
          confirmButton='Sim'
          cancelButton='Não'
          open={this.state.confirmOpen}
          onCancel={() => this.setOpenConfirm(false)}
          onConfirm={e => this.handleDeleteCard()}
        />
        <Grid.Row columns={1}>
          <Grid.Column padded='horizontally' width={16}>
            <Header as='h2' attached='top'>
              Seus cards
            </Header>
            <Segment attached>
              <FilterForm
                decks={deckList}
                isFetchingDecks={isFetchingDecks}
                onSubmit={this.onSubmitSearch}
                isFetchingCards={isFetchingCards}
              />
              <div className='ui divider' />
              <CardList cards={cardList} onClickEdit={this.handleEditClick} onClickDelete={this.handleDeleteClick} onClickSuspend={this.handleSuspendClick} onClickUnsuspend={this.handleUnsuspendClick}/>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const mapStateToProps = state => {
  return {
    cardList: state.app.cards.cardList,
    paginator: state.app.cards.paginator,
    isFetchingCards: state.app.cards.isFetching,
    isFetchingDecks: state.app.decks.ui.isFetching,

    deckList: state.app.decks.decksList
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchCards,
      deleteCard,
      suspendCard,
      unsuspendCard,

      fetchDeckList,
      showModal,
      hideModal
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(
  CardsBrowserContainer
)

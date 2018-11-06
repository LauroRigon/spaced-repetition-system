import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Grid, Button, Loader } from 'semantic-ui-react';
import { toastr } from 'react-redux-toastr'
import CardComponent from '../../../components/UI/Card/CardComponent';
import AnswerBar from '../../../components/UI/AnswerBar/AnswerBar';
import If from 'app/components/UI/If'

import { getDeckToReview, getCardToReview, resetState, setRevealAnswer, sendAnswer, shiftCardsToReview, setReviewDone } from './actions'


class ReviewController extends Component {
  constructor (props) {
    super(props)

    this.onFetchDeck = this.onFetchDeck.bind(this)
    this.handleRevealClick = this.handleRevealClick.bind(this)
    this.handleAnswerClick = this.handleAnswerClick.bind(this)
    this.handleNextCardClick = this.handleNextCardClick.bind(this)
    this.onReviewCardDone = this.onReviewCardDone.bind(this)
  }

  componentWillMount () {
    this.fetchDeck()
  }

  componentWillUnmount () {
    this.props.resetState()
  }

  fetchDeck () {
    const deck_param = this.props.match.params.id
    this.props.getDeckToReview(deck_param, this.onFetchDeck)
  }

  onFetchDeck () {
    if(this.props.cardsOnQueue.length != 0) {
      this.fetchNextCard()
    } else {
      this.props.setReviewDone(true)
    }
    
  }

  fetchNextCard () {
    const nextCard = this.props.cardsOnQueue[0]
    
    if(nextCard) {
      this.props.setRevealAnswer(false)
      this.props.getCardToReview(nextCard)
    } else {
      this.fetchDeck()
    }
  }

  handleRevealClick () {
    this.props.setRevealAnswer(true)
  }

  handleAnswerClick (ease_chosen) {
    this.props.sendAnswer(this.props.reviewingCard.id, ease_chosen, this.onReviewCardDone)
  }

  handleNextCardClick () {
    this.props.sendAnswer(this.props.reviewingCard.id, 0, this.onReviewCardDone)
  }

  onReviewCardDone (newFactor) {
    this.props.shiftCardsToReview()
    if(newFactor.interval <= 0) {
      toastr.success(`Próxima revisao em poucos minutos!`)  
    } else{
      toastr.success(`Próxima revisao em ${newFactor.interval} dias!`)
    }
    this.fetchNextCard()
  }

  render () {
    const {
      ui,
      deck: {config},
      reviewingCard,
    } = this.props

    const front_content = reviewingCard.front_content
    const back_content = reviewingCard.back_content

    const front_image = front_content && front_content.medias.find((media) => isImage(media.type))
    const front_audio = front_content && front_content.medias.find((media) => isAudio(media.type))

    const back_image = back_content && back_content.medias.find((media) => isImage(media.type))
    const back_audio = back_content && back_content.medias.find((media) => isAudio(media.type))

    if(ui.reviewDone) {
      return this.renderDoneMessage()
    }

    return (
      <React.Fragment>
        <Loader active={ui.fetchingDeck}/>
        <If test={!ui.fetchingDeck}>
          <Grid padded={true}>
            <Grid.Row>
              <Grid.Column width={16} >
                <CardComponent 
                  textContent={front_content && reviewingCard.front_content.text} 
                  imageSrc={front_image && front_image.URL} 
                  audioSrc={front_audio && front_audio.URL}
                  autoPlayMedia={ config ? !!config.auto_play_media : true }
                />
              </Grid.Column>
            </Grid.Row>
            <If test={ui.revealAnswer}>
              <Grid.Row>
                <Grid.Column width={16} className='boingUp'>
                  <CardComponent 
                    textContent={back_content && reviewingCard.back_content.text}
                    imageSrc={back_image && back_image.URL} 
                    audioSrc={back_audio && back_audio.URL}
                    autoPlayMedia={ config ? !!config.auto_play_media : true }
                  />
                </Grid.Column>
              </Grid.Row>
            </If>
          </Grid>
          <AnswerBar
            loading={ui.submitingAnswer}
            isLearning={(reviewingCard.user_factor && reviewingCard.user_factor[0].card_status == 'new')}
            showAnswerButtons={ui.revealAnswer}
            handleRevealClick={this.handleRevealClick}
            handleAnswerClick={this.handleAnswerClick}
            handleNextCardBtnClick={this.handleNextCardClick}
          />
        </If>
      </React.Fragment>
    )
  }

  renderDoneMessage () {
    return (
      <Grid columns={1}>
        <Grid.Row centered>
          <Grid.Column mobile={16} tablet={12} computer={7} textAlign='center' style={{margin: '13% 0'}}>
            <h1 style={{color: '#b7b7b7', fontSize: '80px'}}>Parabéns!</h1>
            <h3 style={{fontSize: '40px'}}>Revisão completa.</h3>
            <p>Você já terminou de revisar esse deck.</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

const isImage = (type) => {
  const imgTypes = ['jpg', 'jpeg', 'png']

  return imgTypes.includes(type)
}

const isAudio = (type) => {
  const audioTypes = ['mpga']

  return audioTypes.includes(type)
}

const mapStateToProps = state => {
  return {
    deck: state.app.review.reviewingDeck,
    reviewingCard: state.app.review.reviewingCard,
    cardsOnQueue: state.app.review.cardsToReview,
    ui: state.app.review.ui
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    getDeckToReview,
    getCardToReview,
    resetState,
    setRevealAnswer,
    sendAnswer,
    shiftCardsToReview,
    setReviewDone,
  }, dispatch)
}

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ReviewController)
  )

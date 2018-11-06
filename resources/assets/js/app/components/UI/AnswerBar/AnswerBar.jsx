import React from 'react'
import './index.css'
import { Button, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types'

const AnswerBar = props => {
  var btnActions;

  if(props.showAnswerButtons) {
    if(props.isLearning) {
      btnActions = renderNextCardBtn(props.handleNextCardBtnClick, props.loading)
    } else {
      btnActions = renderFiveAnswers(props.handleAnswerClick, props.loading)
    }

  } else {
    btnActions = renderRevealButton(props.handleRevealClick)
  }

  return (
    <div className="answer-bar ui centered grid">
      <div className="centered">
        <div className="answer-bar-actions">
          {/* <Loader active={props.loading}/> */}
          {btnActions}
        </div>
      </div>
    </div>
  )
}

const renderRevealButton = (handleClick) => {
  return (<Button primary onClick={handleClick}>Ver resposta</Button>)
}

const renderNextCardBtn = (handleClick, loading = false) => {
  return (<Button primary onClick={handleClick} loading={loading} disabled={loading}>Próximo</Button>)
}

const renderFiveAnswers = (handleClick, loading) => {

  return (
    <React.Fragment>
      <Button onClick={() => handleClick(0)} disabled={loading}>
        0
      </Button>
      <Button onClick={() => handleClick(1)} disabled={loading}>
        1
      </Button>
      <Button onClick={() => handleClick(2)} disabled={loading}>
        2
      </Button>
      <Button onClick={() => handleClick(3)} disabled={loading}>
        3
      </Button>
      <Button onClick={() => handleClick(4)} disabled={loading}>
        4
      </Button>
      <Button onClick={() => handleClick(5)} disabled={loading}>
        5
      </Button>
    </React.Fragment>
  )
}

AnswerBar.propTypes = {
  isLearning: PropTypes.bool,
  showAnswerButtons: PropTypes.bool,
  loading: PropTypes.bool,

  handleNextCardBtnClick: PropTypes.func,
  
  handleRevealClick: PropTypes.func,

  handleAnswerClick: PropTypes.func
}

export default AnswerBar

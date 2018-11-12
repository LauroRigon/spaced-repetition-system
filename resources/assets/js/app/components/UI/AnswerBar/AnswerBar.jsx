import React from 'react'
import './index.css'
import { Button, Loader, Popup } from 'semantic-ui-react';
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
    btnActions = renderRevealButton(props.handleRevealClick, props.loading)
  }

  return (
    <div className="answer-bar ui centered grid">
      <div className="centered">
        <div className="answer-bar-actions">
          {btnActions}
        </div>
      </div>
    </div>
  )
}

const renderRevealButton = (handleClick, loading) => {

  console.log(loading)
  return (<Button primary onClick={handleClick} loading={loading} disabled={loading}>Ver resposta</Button>)
}

const renderNextCardBtn = (handleClick, loading = false) => {
  return (<Button primary onClick={handleClick} loading={loading} disabled={loading}>Próximo</Button>)
}

const renderFiveAnswers = (handleClick, loading) => {
  var buttons = []
  const popupContents = [
    'Completamente esquecida.',
    'Incorreta. Lembrada quando revelada.',
    'Incorreta. A correnta parece ser fácil.',
    'Correta. Com dificuldade para lembrar.',
    'Correta. Após uma pequena indecisão.',
    'Correta.'
  ]

  for (let index = 0; index <= 5; index++) {
    const button = (
      <Popup
        key={index} 
        content={popupContents[index]}
        position='top center'
        trigger={(<Button className={`btn ans-${index}`} onClick={() => handleClick(index)} disabled={loading}>
                  {index}
                  </Button>)} 
      />
    )
    buttons.push(button)
  }

  return (
    <React.Fragment>
      {buttons}
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

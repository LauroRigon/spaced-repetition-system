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
      {/* <Popup 
        content='Completamente esquecida'
        position='top center'
        trigger={(<Button className='btn ans-0' data-content="Add users to your feed" onClick={() => handleClick(0)} disabled={loading}>
                  0
                  </Button>)} 
      />

      <Popup 
        content='Incorreta. Lembrada quando revelada'
        position='top center'
        trigger={(<Button className='btn ans-0' data-content="Add users to your feed" onClick={() => handleClick(1)} disabled={loading}>
                    1
                  </Button>)}
      />

      <Popup 
        content='Incorreta. A correnta parece ser fácil'
        position='top center'
        trigger={(<Button className='btn ans-1' onClick={() => handleClick(2)} disabled={loading}>
                    2
                  </Button>)}
      />

      <Popup 
        content='Correta. Com dificuldade para lembrar'
        position='top center'
        trigger={(<Button className='btn ans-3' onClick={() => handleClick(3)} disabled={loading}>
                    3
                  </Button>)}
      />

      <Popup 
        content='Correta. Após uma pequena indecisão'
        position='top center'
        trigger={(<Button className='btn ans-4' onClick={() => handleClick(4)} disabled={loading}>
                    4
                  </Button>)}
      />

      <Popup 
        content='Correta. Após uma pequena indecisão'
        position='top center'
        trigger={(<Button className='btn ans-4' onClick={() => handleClick(4)} disabled={loading}>
                    4
                  </Button>)}
      />

      
      
      
      <Button className='btn ans-5' onClick={() => handleClick(5)} disabled={loading}>
        5
      </Button> */}
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

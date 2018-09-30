import React from 'react'
import PropTypes from 'prop-types'
import { Header, Segment } from 'semantic-ui-react'

import If from 'app/components/UI/If'

const DeckView = ({ deck }) => {
  console.log(deck)
  return (
    <React.Fragment>
      <Header as='h2' attached='top'>
        Deck: {deck.name}
      </Header>
      <Segment attached>
        <p>
          <If test={deck.owner && deck.is_public}>
            <strong>Criado Por:</strong> {deck.owner && deck.owner.name}<br />
          </If>
          <strong>Criado em:</strong> {deck.created_at} <br />
          <strong>Atualizado em:</strong> {deck.updated_at} <br />
          <If test={deck.pivot && deck.pivot.folder}>
            <strong>Pasta:</strong> {deck.pivot && deck.pivot.folder} <br />
          </If>
          <strong>Deck público:</strong> {deck.is_public ? 'Sim' : 'Não'} <br />
        </p>

        <Header as='h4'>
          Descrição:{' '}
        </Header>
        <p>
          {deck.description}
        </p>
      </Segment>
    </React.Fragment>
  )
}

DeckView.propTypes = {
  deck: PropTypes.object
}

export default DeckView

import React from 'react'
import { Item, Segment, Label, Header, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const PublicDecksList = ({ items }) => {
  return (
    <div>
      <Item.Group>
        {renderDeckList(items)}
      </Item.Group>
    </div>
  )
}

function renderDeckList (decks) {
  console.log(decks)
  if(!decks.length) {
    return (<h2>Sem resultados</h2>)
  }

  return decks.map((deck, i) => (
    <Segment key={i}>
      <Item>
        <Item.Content>
          <Item.Header as='h2'>
            {figureOutLinkToDeck(deck.id, deck.name)}
          </Item.Header>
          <Label color='blue' style={{marginBottom: 10}}>
              <strong>Criado Por: </strong>
              {deck.owner.name}
            </Label>
          <Item.Meta>
            <Header as='h4'>
              Descrição:{' '}
            </Header>
            <Button primary floated='right' size='small' basic>
              {figureOutLinkToDeck(deck.id, 'Visualizar')}
              <Icon name='right chevron' />
            </Button>
          </Item.Meta>
          <Item.Description>
            <p style={{ margin: '10px' }}>
              {deck.description}
            </p>
          </Item.Description>
          <Item.Extra>
            <Label>
              <strong>Criado em: </strong>
              {deck.created_at}
            </Label>
            <Label>
              <strong>Atualizado em: </strong>
              {deck.updated_at}
            </Label>
          </Item.Extra>
        </Item.Content>
      </Item>
    </Segment>
  ))
}

function figureOutLinkToDeck (deck_id, label) {
  return <Link to={`decks/${deck_id}`}>{label}</Link>
}
export default PublicDecksList

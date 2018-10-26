import React from 'react'
import PropTypes from 'prop-types'
import { Header, Segment, Grid, Label, List } from 'semantic-ui-react'

import If from 'app/components/UI/If'

const DeckView = ({ deck }) => {
  console.log(deck)
  return (
    <React.Fragment>
      <Header as='h2' attached='top'>
        Deck: {deck.name}
      </Header>
      <Segment attached>
      <Grid columns='equal' divided>
        <Grid.Row>
        <Grid.Column>
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
        </Grid.Column>
        <If test={!!deck.pivot}>
          <Grid.Column widescreen={4} computer={5} tablet={6} floated='right' textAlign='right'>
            <Header as='h4'>
              Cards:{' '}
            </Header>
            <List>
              <List.Item>
                <List.Content>
                {/* <strong>Novos: </strong> */}
                  <Label circular color='blue'>
                    {deck.new_cards_count} novos
                  </Label>
                </List.Content>
              </List.Item>
              <List.Item>
                
                <List.Content>
                {/* <strong>Aprendendo: </strong> */}
                  <Label circular color='brown'>
                  {deck.learning_cards_count} aprendendo
                  </Label>
                </List.Content>
              </List.Item>
              <List.Item>
                
                <List.Content>
                {/* <strong>Para revisar: </strong> */}
                  <Label circular color='green'>
                  {deck.reviewing_cards_count} para revisar
                  </Label>
                </List.Content>
              </List.Item>
            </List>
          </Grid.Column>
        </If>
        </Grid.Row>
      </Grid>
      </Segment>
    </React.Fragment>
  )
}

DeckView.propTypes = {
  deck: PropTypes.object
}

export default DeckView

import React from 'react'
import { Table, Dropdown, Label } from 'semantic-ui-react'
import { limitString } from 'app/services/helpers'
import If from '../../UI/If'

class CardList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { cards } = this.props;
    return (
      <div style={{overflow: 'overlay'}}>
        <Table celled striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Frente</Table.HeaderCell>
              <Table.HeaderCell>Verso</Table.HeaderCell>
              <Table.HeaderCell>Deck</Table.HeaderCell>
              <Table.HeaderCell>Criado em</Table.HeaderCell>
              {/* <Table.HeaderCell>Ações</Table.HeaderCell> */}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.renderTableRows(cards)}
          </Table.Body>
        </Table>
      </div>
    )
  }

  renderTableRows (cards) {
    return cards.map((card, index) => (
      <Table.Row key={index}>
        <Table.Cell>
        <If test={!!card.suspended_at}>
          <Label as='a' color='red' ribbon size='tiny'>
            Suspenso
          </Label>
        </If>
          {/* retira tags html */}
          {limitString(card.front_content.text.replace(/<[^>]*>?/g, ''), 40)}
        </Table.Cell>
        <Table.Cell>
          {/* retira tags html */}
          {limitString(card.back_content.text.replace(/<[^>]*>?/g, ''), 40)}
        </Table.Cell>
        <Table.Cell>
          {card.deck.name}
        </Table.Cell>
        <Table.Cell>
          {card.created_at}
        </Table.Cell>
        <Table.Cell>
          <Dropdown
            icon='settings'
            floating
            pointing='top right'
            button
            basic
            direction='left'
            className='icon'
          >
            <Dropdown.Menu>
              <Dropdown.Header content='Ações' />
              <Dropdown.Divider />
              <Dropdown.Item icon='edit' text='Editar' onClick={() => this.props.onClickEdit(card)}/>
              <Dropdown.Item icon='close' text='Excluir' onClick={() => this.props.onClickDelete(card)}/>
              <If test={!card.suspended_at}>
                <Dropdown.Item icon='stop circle outline' text='Suspender' onClick={() => this.props.onClickSuspend(card)}/>
              </If>
              <If test={!!card.suspended_at}>
                <Dropdown.Item icon='play circle outline' text='Continuar' onClick={() => this.props.onClickUnsuspend(card)}/>
              </If>
            </Dropdown.Menu>
          </Dropdown>
        </Table.Cell>
      </Table.Row>
    ))
  }
}

export default CardList

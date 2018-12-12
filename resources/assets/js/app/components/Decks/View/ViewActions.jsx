import React from 'react'
import PropTypes from 'prop-types'
import { Header, Segment, Button, Confirm, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import If from 'app/components/UI/If'

const ViewActions = ({
  authenticatedUser,
  deck,
  handleDeleteDeck,
  openDeleteConfirm,
  closeDeleteConfirm,
  handleOpenDeleteConfirm,
  handleOpenEditModal,
  handleOpenAddCardsModal,
  handleOpenSubscribeModal,
  handleOpenSubscribedEditModal,
  handleUnsubscribeClick
}) => {
  return (
    <React.Fragment>
      <Header as='h2' attached='top' textAlign='center'>
        Ações
      </Header>
      <Segment attached>

        <If test={deck.pivot} >
          <Link to={`/decks/${deck.id}/review`} >
            <Button compact fluid color='green'>
                Estudar
            </Button>
          </Link>
          <div className='ui section divider' />
        </If>

        <If test={deck.creator_id == authenticatedUser.id}>
          <Button compact fluid primary onClick={handleOpenAddCardsModal}>
            Adicionar Card
          </Button>
          <div className='ui section divider' />
        </If>

        
        <If test={authenticatedUser.id == deck.creator_id}>
          <Button
            style={{ margin: '3px 0' }}
            compact
            fluid
            icon
            labelPosition='left'
            color='yellow'
            onClick={handleOpenEditModal}
          >
            <Icon name='edit' /> Editar
          </Button>
          <Button
            compact
            fluid
            icon
            labelPosition='left'
            negative
            onClick={handleOpenDeleteConfirm}
          >
            <Icon name='delete' /> Excluir
          </Button>
          <Confirm
            className='animated zoomIn'
            content='Tem certeza que quer deletar esse deck?'
            confirmButton='Sim'
            cancelButton='Não'
            open={openDeleteConfirm}
            onCancel={closeDeleteConfirm}
            onConfirm={handleDeleteDeck}
          />
        </If>

        <If test={authenticatedUser.id != deck.creator_id}>
          <If test={deck.pivot}>
            <Button color='yellow' fluid onClick={handleOpenSubscribedEditModal} style={{marginBottom: '5px'}}>
              Editar
            </Button>
            <Button basic color='red' fluid onClick={handleUnsubscribeClick}>
              Desinscrever-se
            </Button>
          </If>

          <If test={!deck.pivot}>
            <Button basic color='blue' fluid onClick={handleOpenSubscribeModal}>
              Inscrever-se
            </Button>
          </If>
        </If>
      </Segment>
    </React.Fragment>
  )
}

ViewActions.propTypes = {}

export default ViewActions

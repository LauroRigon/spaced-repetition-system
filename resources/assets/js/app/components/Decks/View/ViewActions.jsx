import React from 'react'
import PropTypes from 'prop-types'
import { Header, Segment, Button, Confirm, Icon } from 'semantic-ui-react'

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
  handleUnsubscribeClick
}) => {
  return (
    <React.Fragment>
      <Header as='h2' attached='top' textAlign='center'>
        Ações
      </Header>
      <Segment attached>
        <If test={deck.creator_id == authenticatedUser.id}>
          <Button compact fluid primary onClick={handleOpenAddCardsModal}>
            Adicionar Card
          </Button>
        </If>

        <div className='ui section divider' />
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
            <Button basic color='red' onClick={handleUnsubscribeClick}>
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

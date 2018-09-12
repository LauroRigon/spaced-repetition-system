import React from 'react'
import PropTypes from 'prop-types'
import { Header, Segment, Button, Confirm, Icon } from 'semantic-ui-react'

import If from 'app/components/UI/If'

const ViewActions = ({
  authenticatedUserId,
  deckCreatorId,
  handleDeleteDeck,
  openDeleteConfirm,
  closeDeleteConfirm,
  handleOpenDeleteConfirm,
  handleOpenEditModal
}) => {
  return (
    <React.Fragment>
      <Header as='h2' attached='top' textAlign='center'>
        Ações
      </Header>
      <Segment attached>

        <Button compact fluid primary>
          Adicionar Card
        </Button>

        <div className='ui section divider' />
        <If test={authenticatedUserId == deckCreatorId}>
          <Button
            style={{margin: '3px 0'}}
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

        <If test={authenticatedUserId != deckCreatorId}>
          <Button basic color='red'>
            Desinscrever-se
          </Button>
        </If>
      </Segment>
    </React.Fragment>
  )
}

ViewActions.propTypes = {}

export default ViewActions

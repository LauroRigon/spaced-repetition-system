import React from 'react'
import PropTypes from 'prop-types'
import { List, Image } from 'semantic-ui-react'
import deckImg from 'app/../../img/deck.png'
import { Link } from 'react-router-dom'

const DecksList = props => {
  if (!props.decks.length) {
    return (
      <div className='center aligned'><h2>Você não tem nenhum deck.</h2></div>
    )
  }

  const folders = getFolders(props.decks)

  return (
    <React.Fragment>
        <List divided verticalAlign='middle'>
          {renderFolders(folders, props.decks)}
        </List>
    </React.Fragment>
  )
}

function renderFolders (foldersArray, decks) {
  return foldersArray.sort((a, b) => a != '/').map((folder, index) => {
    return (
      <List.Item key={index}>
        <List.Icon name='folder' size='large' />
        <List.Content style={{ width: '100%' }} verticalAlign='middle'>
          <List.Header as='h3'>{folder}</List.Header>
          <List.List>
            {renderFolderDecks(folder, decks)}
          </List.List>
        </List.Content>
      </List.Item>
    )
  })
}

function renderFolderDecks (folder, decks) {
  var decksToRender = []

  decks.forEach((deck, index) => {
    if (deck.pivot.folder != folder) {
      return false
    }

    decksToRender.push(deck)
  })

  return renderDecks(decksToRender)
}

function renderDecks (decks) {
  return decks.map((deck, index) => {

    return (
        <List.Item key={(index + (Math.random() * 100))} style={{ height: '40px' }}>
          <Image avatar src={deckImg} />
          {/* <List.Icon name='clone' style={{padding: '10px 0'}}/> */}
          <List.Content>
            <List.Header as='h4'><Link to={`/decks/${deck.id}`}>{deck.name}</Link></List.Header>
          </List.Content>
        </List.Item>
    )
  })
}

function getFolders (decks) {
  var folders = findFolders(decks)
  return folders
}

function findFolders (decks) {
  var folders = []

  decks.forEach((deck, index, array) => {
    let directory = deck.pivot.folder

    if (!folders.includes(directory)) {
      folders.push(directory)
    }
  })

  return folders
}

DecksList.propTypes = {}

export default DecksList

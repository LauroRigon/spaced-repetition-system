import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button, Modal, Grid, Segment, Header, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import FormModal from '../../../components/Decks/FormModal'
import { SubmissionError } from 'redux-form'
import {
  submitForm,
  setModalOpen,
  fetchDeckList,
} from './actions'

import { fetchDeckConfigList } from '../DeckConfigs/actions'

import DecksList from '../../../components/Decks/List'

class Decks extends Component {
  constructor (props) {
    super(props)

    this.handleModalOpen = this.handleModalOpen.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.props.fetchDeckConfigList()
    this.props.fetchDeckList()
  }

  handleModalOpen () {
    this.props.setModalOpen(true)
  }

  handleModalClose () {
    this.props.setModalOpen(false)
  }

  handleSubmit (values) {
    const onSuccessFetchAgain = this.props.fetchDeckList
    
    this.props.submitForm('post', values, onSuccessFetchAgain)  
    
  }

  render () {
    const { ui, decks, configList } = this.props

    return (
      <React.Fragment>
        <Grid padded='vertically'>
          <FormModal
            modalOpen={ui.modalOpen}
            handleModalClose={this.handleModalClose}
            icon='plus'
            header='Criar deck'
            buttonLabel='Criar'
            loading={ui.isSubmitting}
            configList={configList}
            onSubmit={this.handleSubmit}
          />

          <Grid.Row columns={1}>
            <Grid.Column padded='horizontally' width={16}>
              <Header as='h2' attached='top'>
                Seus decks
              </Header>
              <Segment attached loading={(ui.isFetching && !decks.length)}>
                <Button
                  icon
                  labelPosition='left'
                  primary
                  onClick={this.handleModalOpen}
                >
                  <Icon name='plus' /> Novo
                </Button>
                <Link to={`/decks-configs`}>
                  <Button icon='cog' color='grey' circular floated='right'/>
                </Link>
                <DecksList decks={decks} />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.app.decks.list,
    ui: state.app.decks.ui,
    decks: state.app.decks.decksList,
    configList: state.app.deckConfigs.configList
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      submitForm,
      setModalOpen,
      fetchDeckList,

      fetchDeckConfigList,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Decks)

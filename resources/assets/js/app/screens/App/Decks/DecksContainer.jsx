import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button, Modal, Grid, Segment, Header, Icon } from 'semantic-ui-react'
import DecksForm from '../../../components/Decks/Form'

import {
  setName,
  setDesc,
  setFolder,
  setConfig,
  submitForm,
  setModalOpen,
  fetchDeckList
} from './actions'
import { fetchDeckConfigList } from '../DeckConfigs/actions'

import DecksList from '../../../components/Decks/List'

class Decks extends Component {
  constructor (props) {
    super(props)

    this.handleModalOpen = this.handleModalOpen.bind(this)
    this.handleModalClose = this.handleModalClose.bind(this)
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleDescChange = this.handleDescChange.bind(this)
    this.handleFolderChange = this.handleFolderChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.props.fetchDeckConfigList()
    this.fechList()
  }

  /**
   * Formulario
   */
  handleModalOpen () {
    this.props.setModalOpen(true)
  }

  handleModalClose () {
    this.props.setModalOpen(false)
  }

  handleNameChange (value) {
    this.props.setName(value)
  }

  handleDescChange (value) {
    this.props.setDesc(value)
  }

  handleFolderChange (value) {
    this.props.setFolder(value)
  }

  handleSubmit (method, data, ) {
    const successFetchAgain = this.props.fetchDeckList
    this.props.submitForm(method.toLowerCase(), data, successFetchAgain)
  }

  /**
   * Lista de decks
   */

  fechList () {
    this.props.fetchDeckList()
  }

  render () {
    const { form, ui, decks, configList } = this.props

    return (
      <React.Fragment>
        <Grid padded='vertically'>
            <Modal
              open={ui.modalOpen}
              onClose={this.handleModalClose}
              size='small'
              closeIcon='close'
              className='animated zoomIn'
            >
              <Modal.Content>
                <DecksForm
                  icon='plus'
                  header='Criar deck'
                  buttonLabel='Criar'
                  loading={form.isLoading}
                  errors={form.errors}
                  nameValue={form.data.name}
                  handleNameChange={this.handleNameChange}
                  descValue={form.data.description}
                  handleDescChange={this.handleDescChange}
                  folderValue={form.data.folder}
                  handleFolderChange={this.handleFolderChange}

                  configValue={form.data.deck_config_id}
                  handleConfigChange={this.props.setConfig}
                  configList={configList}
                  
                  onSubmit={e => this.handleSubmit('POST', form.data)}
                />
              </Modal.Content>
            </Modal>

          <Grid.Row columns={1}>
            <Grid.Column padded='horizontally' width={16}>
              <Header as='h2' attached='top'>
                Seus decks
              </Header>
              <Segment attached loading={ui.isFetching}>
                <Button
                  icon
                  labelPosition='left'
                  primary
                  onClick={this.handleModalOpen}
                >
                  <Icon name='plus' /> Novo
                </Button>
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
    form: state.app.decks.form,
    list: state.app.decks.list,
    ui: state.app.decks.ui,
    decks: state.app.decks.decksList,
    configList: state.app.deckConfigs.configList
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setName,
      setDesc,
      setFolder,
      setConfig,
      submitForm,
      setModalOpen,
      fetchDeckList,

      fetchDeckConfigList
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Decks)

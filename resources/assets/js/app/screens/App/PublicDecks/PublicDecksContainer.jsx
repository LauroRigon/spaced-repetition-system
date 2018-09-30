import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { fetchList } from './actions'
import PublicDecksList from '../../../components/PublicDecks/List'
import { Grid, Segment, Pagination, Icon, Form, Button } from 'semantic-ui-react'
import { withRouter } from 'react-router'
import { reduxForm, Field } from 'redux-form'
import LabelAndInput from '../../../components/UI/Inputs/LabelAndInput';

class PublicDecksContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialQuery: ''
    }
    this.fetchList = this.fetchList.bind(this)
    this.handleClickSearch = this.handleClickSearch.bind(this)
  }

  componentDidMount() {
    const initialQuery = this.getQuery()
    this.setState({...this.state, initialQuery: initialQuery})
    this.props.initialize({query_input: initialQuery})
  }

  componentWillMount () {
    this.fetchList()
  }

  getQuery() {
    var params = new URLSearchParams(this.props.location.search)
    var query = params.get('search')
    return query
  }

  fetchList() {
    if(this.props.isFetching) {
      return null
    }
    
    const query = this.getQuery()
    this.props.fetchList(`decks/public-decks/${query || ''}`)
  }

  fetchNewPage(url) {
    if(this.props.isFetching) {
      return null
    }

    if(url){
      this.props.fetchList(url)
    }
  }

  handleClickSearch(value) {
    if(!value.query_input) {
      value.query_input = ''
    }

    this.props.history.push({
      pathname: '/public-decks',
      search: `?search=${value.query_input}`
    })
  }

  renderPaginator() {
    const {
      paginator
    } = this.props
    
    const {
      prev_page_url,
      next_page_url,
      current_page
    } = paginator

    return (
      <div className='ui pagination pointing secondary menu'>
        <a className={`item ${current_page == 1 ? 'disabled' : ''}`} onClick={() => this.fetchNewPage(paginator.first_page_url)}><Icon name='angle double left' size='small'/></a>
        <a className={`item ${!prev_page_url ? 'disabled' : ''}`} onClick={() => this.fetchNewPage(paginator.prev_page_url)}><Icon name='angle left' size='small'/></a>
        <a className='active item'>{paginator.current_page ? paginator.current_page : 1}</a>
        <a className={`item ${!next_page_url ? 'disabled' : ''}`} onClick={() => this.fetchNewPage(paginator.next_page_url)}><Icon name='angle right' size='small'/></a>
      </div>
    )
  }

  render () {
    const { handleSubmit, list, isFetching } = this.props
    return (
      <React.Fragment>
        <Grid columns={1} padded='vertically' >
          <Grid.Column computer={12} tablet={15}>
            {/* <Segment> */}
              <Form onSubmit={handleSubmit(this.handleClickSearch)}>
              <Form.Group inline>
                <Field value={this.state.initialQuery} width={16} placeholder='Digite usa pesquisa aqui' name='query_input' icon='search' loading={isFetching} label='Procurar: ' component={LabelAndInput}/>
                <Button primary compact size='large' content='Buscar'/>
              </Form.Group>
              </Form>
            {/* </Segment> */}
          </Grid.Column>
          <Grid.Column width={16}>
            <PublicDecksList items={list} />
          </Grid.Column>
          <Grid.Column width={4}>

            {this.renderPaginator()}

          </Grid.Column>
        </Grid>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.app.publicDecks.publicDecksList,
    paginator: state.app.publicDecks.paginator,
    isFetching: state.app.publicDecks.isFetching,
  }
}

const mapDispathToProps = dispatch =>
  bindActionCreators(
    {
      fetchList
    },
    dispatch
  )

PublicDecksContainer = withRouter(
  connect(mapStateToProps, mapDispathToProps)(PublicDecksContainer)
)

export default reduxForm({form: 'search', destroyOnUnmount: false})(PublicDecksContainer)

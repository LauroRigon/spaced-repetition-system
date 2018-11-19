import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './index.css'

import { Grid, Loader, Header } from 'semantic-ui-react';

import { getReviewsAmountByDate } from './actions'

class ScheduledController extends Component {
  constructor (props) {
    super(props)

    moment.locale('pt-br')
    this.localizer = BigCalendar.momentLocalizer(moment)
  }

  componentWillMount () {
    this.props.getReviewsAmountByDate()
  }
  

  render () {
    
    const {
      reviewsByDate,
      ui
    } = this.props

    const reviewEvents = transformToEvent(reviewsByDate);

    return (
      <React.Fragment>
        <Grid columns={2} stackable padded='vertically' style={{height: '650px'}}>
          <Grid.Column largeScreen={12} computer={16} tablet={16} style={{height: '600px'}}>
            <Header as='h2' attached='top'>
                  Revisões agendadas
            </Header>
            <Loader active={ui.fetchingData}/>
            <BigCalendar 
              startAccessor='start'
              endAccessor='end'
              localizer={this.localizer}
              messages={{
                month: 'Mês',
                week: 'Semana',
                day: 'Dia',
                today: 'Hoje',
                previous: 'Anterior',
                next: 'Próximo',
                noEventsInRange: 'Sem revisões para mostrar.',
              }}
              events={reviewEvents}              
              
            
            />
          </Grid.Column>
        </Grid>
      </React.Fragment>
    )
  }
}

const transformToEvent = (datesObj) => {
  return Object.keys(datesObj).map((date, index) => {
    const dateToCalendar = new Date(moment(date)._i + ' 10:00:01')

    console.log({dateToSHow: dateToCalendar, realDate: date})

    return {
      title: datesObj[date] + ' revisões',
      allDay: true,
      start: dateToCalendar,
      end: dateToCalendar 
    }
  })
}

const mapStateToProps = state => {
  return {
    reviewsByDate: state.app.scheduled.reviewAmountByDate,
    ui: state.app.scheduled.ui
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    getReviewsAmountByDate,

  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledController)
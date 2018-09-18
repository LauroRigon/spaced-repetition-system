import React from 'react'
import PropTypes from 'prop-types'
import { Dimmer, Loader } from 'semantic-ui-react'

const AppLoader = () => {
  return (
    <Dimmer active={true} inverted>
      <Loader>Carregando</Loader>
    </Dimmer>
  )
}

AppLoader.propTypes = {}

export default AppLoader

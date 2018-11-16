import React from 'react';
import { Image, Grid, Button, Icon, Label } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'

import './index.css'

const UserBasic = ({ name, image, imageSize }) => {
  return (
    <Grid columns={1}>
      <Grid.Row centered>
        <Grid.Column textAlign='center' as='h2' style={{color: '#009c95', marginBottom: '50px', paddingTop: '50px'}}>
          {name}  
          <Link to={`/account`}>
            <Icon name='edit' className='edit-profile-icon' size='small'/>
          </Link>
        </Grid.Column>
      </Grid.Row>

    </Grid>
  )
}

UserBasic.propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  imageSize: PropTypes.string
}

export default UserBasic;

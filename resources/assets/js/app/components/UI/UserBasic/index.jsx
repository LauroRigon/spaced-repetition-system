import React from 'react';
import { Image, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const UserBasic = ({ name, image, imageSize }) => {
  return (
    <Grid columns={1}>
      <Grid.Row centered>
        <Grid.Column>
          <Image
            src={image}
            bordered
            circular
            centered
            size={imageSize}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row centered>
        <Grid.Column textAlign='center' as='h2'>
          {name}
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

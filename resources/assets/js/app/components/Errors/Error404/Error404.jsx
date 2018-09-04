import React from 'react';
import { Grid } from 'semantic-ui-react';

const Error404 = () => {
  return (
    <React.Fragment>
      <Grid columns={1}>
        <Grid.Row centered>
          <Grid.Column mobile={16} tablet={12} computer={7} textAlign='center' style={{margin: '13% 0'}}>
            <h1 style={{color: '#b7b7b7', fontSize: '80px'}}>Ahh não...</h1>
            <h3 style={{fontSize: '40px'}}>Tivemos um erro!</h3>
            <h4 style={{color: '#b7b7b7', fontSize: '30px'}}>Error 404</h4>
            <p>A página que você procura não existe!</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </React.Fragment>
  )
}

export default Error404;

import React from 'react'
import { Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { doLogout } from './actions';

class AuthLogOutBtn extends React.Component {
  render() {
    return (
      <div>
        <Button size='medium' color="grey" icon='power off' inverted basic circular onClick={this.props.doLogout}></Button>
      <span />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ doLogout }, dispatch)
}

export default connect(null, mapDispatchToProps)(AuthLogOutBtn);

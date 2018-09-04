import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

class OnlyGuestRoute extends Component {
  render() {
    const redirectTo = this.props.location.state || { from: "/" };
    
    return (
      (this.props.authToken == " ")
        ? this.props.children
        : <Redirect to={redirectTo.from} />
    );
  }
}

const mapStateToProps = state => {
  return {
    authToken: state.user.authToken
  }
}

export default withRouter(connect(mapStateToProps)(OnlyGuestRoute));
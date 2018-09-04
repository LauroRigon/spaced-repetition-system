import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';

class PrivateRoute extends Component {
  render() {
    const redirectTo = this.props.location.state || { from: "/auth/login" };
    return (
      (this.props.authToken != " ")
      ? this.props.children 
      : <Redirect to={{
        pathname: redirectTo.from,
        state: { from: this.props.location }
      }} />
    );
  }
}

const mapStateToProps = state => {
  return {
    authToken: state.user.authToken
  }
}

export default withRouter(connect(mapStateToProps)(PrivateRoute));
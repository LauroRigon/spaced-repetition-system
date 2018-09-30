import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReduxToastr from 'react-redux-toastr';
import mountRoutes from './routes';
import { windowResize } from '../actions/ui/settings';
import throttle from 'lodash/throttle';

class ScreensRoot extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    window.addEventListener('resize', throttle(this.props.windowResize, 500))
    
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }
  
  render() {
    return (
      <div>
        <ReduxToastr
          timeOut={4000}
          newestOnTop={false}
          preventDuplicates
          position="top-right"
          transitionIn="fadeIn"
          transitionOut="fadeOut"
          progressBar
          closeOnToastrClick />
        
        {mountRoutes()}
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ windowResize }, dispatch)
}

export default connect(null, mapDispatchToProps)(ScreensRoot);

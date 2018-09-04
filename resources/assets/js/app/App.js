import React, { Component } from 'react';
import ScreensRoot from './screens/Root';
import { AppContainer } from 'react-hot-loader';
import { Provider } from "react-redux";

class App extends Component {
  render() {
    const { store } = this.props;

    return (
      <AppContainer>
        <Provider store={store}>
          <ScreensRoot />
        </Provider>
      </AppContainer>
    );
  }
}

export default App;

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept();
}
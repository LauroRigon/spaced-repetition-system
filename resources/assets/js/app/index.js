import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import storeConf from './store/configureStore';

const store = storeConf;

ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();


import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import multi from 'redux-multi';
import delayMiddleware from '../middlewares/delay';
import { loadState, saveState } from 'app/localStorage';
import throttle from 'lodash/throttle';


  const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  const persistedState = loadState();

  const store = applyMiddleware(thunk, delayMiddleware, multi)(createStore)(rootReducer, persistedState, devTools);

  store.subscribe(throttle(() => {
    const state = store.getState()
    saveState({
      user: state.user,
    })
  }, 1000));

  export default store;

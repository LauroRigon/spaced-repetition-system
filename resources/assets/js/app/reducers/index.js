import { combineReducers } from "redux";

import userReducer from './user';
import uiReducer from './ui';
import loginReducer from '../components/Auth/Login/reducer';
import registerReducer from '../components/Auth/Register/reducer';
import PasswordRecoveryReducer from '../screens/Auth/PasswordRecovery/reducer';
import DecksReducer from '../screens/App/Decks/reducer';
import DeckConfigReducer from '../screens/App/DeckConfigs/reducer';
import { reducer as toastrReducer } from 'react-redux-toastr';

const rootReducer = combineReducers({
  user: userReducer,
  auth: combineReducers({
    login: loginReducer,
    register: registerReducer,
    passwordRecovery: PasswordRecoveryReducer,
  }),
  app: combineReducers({
    decks: DecksReducer,
    deckConfigs: DeckConfigReducer
  }),
  toastr: toastrReducer,
  ui: uiReducer,
});

export default (state, action) => (
  action.type === 'RESET_STATE'
      ? rootReducer(undefined, action)
      : rootReducer(state, action)
)

//export default rootReducer;
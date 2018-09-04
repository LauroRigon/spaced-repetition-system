import { combineReducers } from "redux";

import userReducer from './user';
import uiReducer from './ui';
import loginReducer from '../components/Auth/Login/reducer';
import registerReducer from '../components/Auth/Register/reducer';
import PasswordRecoveryReducer from '../screens/Auth/PasswordRecovery/reducer';
import { reducer as toastrReducer } from 'react-redux-toastr';

const rootReducer = combineReducers({
  user: userReducer,
  auth: combineReducers({
    login: loginReducer,
    register: registerReducer,
    passwordRecovery: PasswordRecoveryReducer,
  }),
  toastr: toastrReducer,
  ui: uiReducer
});

export default rootReducer;
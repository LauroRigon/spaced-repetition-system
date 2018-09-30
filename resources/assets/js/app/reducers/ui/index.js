import * as actions from '../../actions/ui/action-types'
import modals from './modals'
import settings from './settings'
import { combineReducers } from 'redux';

export default combineReducers({settings, modals})


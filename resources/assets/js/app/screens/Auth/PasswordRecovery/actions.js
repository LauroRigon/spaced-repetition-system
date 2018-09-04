import axios from 'axios';
import { toastr } from 'react-redux-toastr';

import * as actions from './action-types';
import { userLoggedIn } from '../../../actions/user'


export function moveForward() {
  return {
    type: actions.STEP_MOVE_FORWARD
  }
}

export function moveBackward() {
  return {
    type: actions.STEP_MOVE_BACKWARD
  }
}

export function resetState() {
  return dispatch => {
    dispatch(moveBackward());
    dispatch({
      type: actions.RESET_STATE,
    });
  }
}

export function setErrors(value) {
  return {
    type: actions.SET_ERRORS,
    payload: value
  }
}

export function setEmail(value) {
  return {
    type: actions.SET_EMAIL,
    payload: value
  }
}

export function setLoading(value) {
  return {
    type: actions.SET_LOADING,
    payload: value
  }
}

export function submitRecoveryRequest(payload) {
  return dispatch => {
    dispatch(setLoading(true))
    axios.post('/api/password/recover', payload)
      .then(response => {
        dispatch(moveForward())
        dispatch(setLoading(false))
      })
      .catch(({ response }) => {
        dispatch(setLoading(false))
        let msg = (response.data.errors) ? response.data.errors.email[0] : response.data.error;
        toastr.error('Ocorreu um erro!', msg);

      })

  }
}

/*
  Reset part
*/
export function setToken(value) {
  return {
    type: actions.SET_TOKEN,
    payload: value.toUpperCase()
  }
}

export function setPassword(value) {
  return {
    type: actions.SET_PASSWORD,
    payload: value
  }
}

export function setPasswordConfirmation(value) {
  return {
    type: actions.SET_PASSWORD_CONFIRM,
    payload: value
  }
}

export function submitResetPassword(payload) {
  return dispatch => {
    dispatch(setLoading(true));
    axios.post('/api/password/reset', payload)
      .then(response => {
        dispatch(setLoading(false));
        dispatch(userLoggedIn(response.data.data));
        dispatch(resetState());
        toastr.success('Tudo certo!', 'Sua senha foi redefinida com sucesso!');
      })
      .catch(({ response }) => {
        dispatch(setLoading(false));
        const errors = response.data.errors || {};

        try {
          dispatch(setErrors(errors));
        } catch (e) {
          toastr.error('Occoreu um erro grave!', e);
        }
      })
  }
}
import * as actions from './action-types'
import api from 'app/services/api'
import { saveState } from 'app/localStorage';

import { setIsLoaded } from '../ui/settings'
/*
Espera-se:
{
  account: {
    userData
  },
  authToken: 'dsadasdsdhsadsadsakj'
}
*/
export function userLoggedIn (data) {
  saveState({user: data})

  return {
    type: actions.USER_LOGGED_IN,
    payload: data
  }
}

export function userLoggedOut () {
  localStorage.removeItem('state')

  return [
    {
      type: actions.USER_LOGGED_OUT
    },
    {
      type: "RESET_STATE"
    }

  ]
}

export function setToken (token) {
  return {
    type: actions.SET_TOKEN,
    payload: token
  }
}

export function checkSession () {
  return dispatch => {
    api
      .get('/check')
      .then(({ data }) => {
        dispatch([userLoggedIn(data.data), setIsLoaded(true)])
      })
      .catch(error => dispatch(userLoggedOut()))
  }
}

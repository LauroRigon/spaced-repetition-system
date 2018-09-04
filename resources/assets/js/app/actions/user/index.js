import * as actions from './action-types'

/* 
Espera-se: 
{
  account: {
    userData
  },
  authToken: 'dsadasdsdhsadsadsakj'
}
*/
export function userLoggedIn(data) {
  return {
    type: actions.USER_LOGGED_IN,
    payload: data
  };
}

export function userLoggedOut() {
  localStorage.removeItem('state');

  return {
    type: actions.USER_LOGGED_OUT
  };
}
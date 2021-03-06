import axios from 'axios';
import store from '../store/configureStore';

import { userLoggedOut } from '../actions/user';

//const token = getCurrentToken();

const api = axios.create({
    baseURL: '/api/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

/**
 * coloca o token antes de cada request
 */
api.interceptors.request.use(config => {
  config.headers['Authorization'] = `Bearer ${getCurrentToken()}`;

  return config;
})

/**
 * se for erro 401, desloga o user
 */
api.interceptors.response.use(response => response, error => {
  if (error.response.status == 401) {
    store.dispatch(userLoggedOut());
  }

  return Promise.reject(error);
})

/**
 * pega o token atual da store
 */
function getCurrentToken() {
  try{
    return store.getState().user.authToken;
  }catch(er) {
    console.log(er)
  }
}

export default api;

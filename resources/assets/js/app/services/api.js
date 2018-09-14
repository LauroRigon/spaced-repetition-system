import axios from 'axios'
import store from '../store/configureStore'
import { saveState } from 'app/localStorage'
import { userLoggedOut, setToken } from '../actions/user'

const token = getCurrentToken()

const api = axios.create({
  baseURL: 'https://floating-garden-78421.herokuapp.com/api/',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

/**
 * coloca o token antes de cada request
 */
api.interceptors.request.use(config => {
  config.headers['Authorization'] = `Bearer ${getCurrentToken()}`
  return config
})

/**
 * se for erro 401, desloga o user,
 * se for response de sucesso, procura por um token refreshado no header
 */
api.interceptors.response.use(
  response => {
    if(response.headers['authorization']) {
      setNewToken(response.headers['authorization'])
    }

    return Promise.resolve(response)
  },
  error => {
    if (error.response.status == 401) {
      store.dispatch(userLoggedOut())
    }

    return Promise.reject(error)
  }
)

/**
 * pega o token atual da store
 */
function getCurrentToken () {
  return store.getState().user.authToken
}

function setNewToken(token) {
  store.dispatch(setToken(token))
  saveState(store)
}
export default api

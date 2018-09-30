import * as actions from './action-types'

/**
 * set the open sidebar state on ui
 * @param {bool} value
 */
export function setIsSidebarOpen (value) {
  return {
    type: actions.SET_IS_SIDEBAR_OPEN,
    payload: value
  }
}

export function windowResize () {
  return {
    type: actions.WINDOW_RESIZE
  }
}

export function setIsLoaded (value) {
  return {
    type: actions.SET_IS_LOADED,
    payload: value
  }
}

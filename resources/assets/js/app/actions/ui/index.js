import * as actions from './action-types';

/**
 * set the open sidebar state on ui
 * @param {bool} value 
 */
export function setIsSidebarOpen(value) {
  return {
    type: actions.SET_IS_SIDEBAR_OPEN,
    payload: value
  }
}

export function windowResize() {
  console.log(window.innerWidth)
  return {
    type: actions.WINDOW_RESIZE
  }
}
import * as actions from './action-types'

export function showModal(type, props = {}) {
  return {
    type: actions.SHOW_MODAL,
    modalType: type,
    modalProps: props
  }
}

export function hideModal() {
  return {
    type: actions.HIDE_MODAL
  }
}
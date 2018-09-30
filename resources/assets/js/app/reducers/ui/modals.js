import * as actions from '../../actions/ui/action-types'

const initialState = {
  modalType: null,
  modalProps: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SHOW_MODAL:
      return {
        modalType: action.modalType,
        modalProps: action.modalProps
      }
    
      case actions.HIDE_MODAL:
        return initialState
  
    default:
      return state
  }
}
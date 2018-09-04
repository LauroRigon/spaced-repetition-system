import * as actions from '../../actions/ui/action-types';

const initialState = {
  isSidebarOpen: true,
  isMobile: window.matchMedia('(max-width: 768px)').matches
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_IS_SIDEBAR_OPEN:
      return { ...state, isSidebarOpen: action.payload }

    case actions.WINDOW_RESIZE:
      const isMobile = window.matchMedia('(max-width: 768px)').matches;

      return {...state, isMobile: isMobile};

    default:
      return state;
  }
}
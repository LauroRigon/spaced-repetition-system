export function loadState() {
  try {
    const stateFromStorage = localStorage.getItem('state');
    
    if(stateFromStorage === null) {
      return undefined;
    }

    return JSON.parse(stateFromStorage);
  } catch(err){
    return undefined;
  }
}

export function saveState(state) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch(err){
    
  }
}
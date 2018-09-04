const delayedActions = [];

const delayMiddleware = store => next => action => {

  const delay = action.meta && action.meta.delay;

  if (!delay) {
    return next(action);
  }

  if(delayedActions.includes(action.type)){
    return null;
  }

  delayedActions.push(action.type);
  setTimeout(() => {
    let indexOfAction = delayedActions.indexOf(action.type);
    delayedActions.splice(indexOfAction, 1);

    return next(action);
  }, delay);
  
}

export default delayMiddleware;
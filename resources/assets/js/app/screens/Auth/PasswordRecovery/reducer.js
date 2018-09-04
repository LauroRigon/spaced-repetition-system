import * as actions from './action-types';

const initialState = {
  steps: [
    {
      key: 'request',
      icon: 'mail',
      title: 'Pedido de recuperação',
      description: 'Forneça seu email para recuperar sua senha.',
      active: true
    },
    {
      key: 'reset',
      icon: 'key',
      title: 'Nova senha',
      description: 'Digite o código de segurança e redefina sua senha.',
      disabled: true,
    },
    {
      key: 'done',
      icon: 'check',
      title: 'Concluído',
      description: 'Pronto, sua senha foi redefinida.',
      disabled: true
    }
  ],
  stepActivated: 'request',
  forms: {
    errors: {},
    email: '',
    reset: {
      token: '',
      password: '',
      password_confirmation: ''
    },
    isLoading: false
  }
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.STEP_MOVE_FORWARD:
      var newSteps = state.steps;   //copia os steps
      var stepActivated = state.stepActivated;

      newSteps.find((item, index, array) => {

        if (item.active && array[index + 1] != undefined) {  //Verifica se é o ativo e se existe um próximo step
          newSteps[index].active = false;
          newSteps[index].completed = true;                //faz as trocas de props

          newSteps[index + 1].active = true;
          newSteps[index + 1].disabled = false;
          stepActivated = newSteps[index + 1].key;

          return true
        }
      });

      return { ...state, steps: [...newSteps], stepActivated: stepActivated };
      break;

    case actions.STEP_MOVE_BACKWARD:
      var newSteps = state.steps;   //copia os steps
      var stepActivated = state.stepActivated;

      newSteps.find((item, index, array) => {

        if (item.active && array[index - 1] != undefined) {  //Verifica se é o ativo e se existe um step anterior
          newSteps[index].active = false;
          newSteps[index].disabled = true;                //faz as trocas de props

          newSteps[index - 1].active = true;
          newSteps[index - 1].disabled = false;
          newSteps[index - 1].completed = false;
          stepActivated = newSteps[index - 1].key;

          return true
        }
      });

      return { ...state, steps: [...newSteps], stepActivated: stepActivated };
      break;

    case actions.SET_ERRORS:

      return { ...state, forms: { ...state.forms, errors: action.payload } }
      break;

    case actions.SET_EMAIL:

      return { ...state, forms: { ...state.forms, email: action.payload } }
      break;

    case actions.SET_LOADING:

      return { ...state, forms: { ...state.forms, isLoading: action.payload } }
      break;

    case actions.SET_TOKEN:
      if (action.payload.length > 6) return state;

      return { ...state, forms: { ...state.forms, reset: { ...state.forms.reset, token: action.payload } } }
      break;

    case actions.SET_PASSWORD:

      return { ...state, forms: { ...state.forms, reset: { ...state.forms.reset, password: action.payload } } }
      break;

    case actions.SET_PASSWORD_CONFIRM:

      return { ...state, forms: { ...state.forms, reset: { ...state.forms.reset, password_confirmation: action.payload } } }

    case actions.RESET_STATE:

      return { ...initialState };
      break;
    default:
      return state;
      break;
  }
}
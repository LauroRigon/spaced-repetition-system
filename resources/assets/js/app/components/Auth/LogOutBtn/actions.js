import {
    userLoggedOut
} from '../../../actions/user';

import api from 'app/services/api';

export function doLogout() {
    return dispatch => {
        api.get('/logout')
            .then(response => {
                dispatch(userLoggedOut());
            })
            .catch(error => {
              dispatch(userLoggedOut());
            })
    };
}

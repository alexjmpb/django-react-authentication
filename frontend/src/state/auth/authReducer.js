import {
    AUTH_REQUEST,
    AUTH_SUCCESS,
    AUTH_FAIL,
    START_SUBMIT,
    FINISH_SUBMIT,
} from './authActionTypes'

const initialState = {
    user: null,
    isAuth: false,
    refreshToken: localStorage.getItem('refresh_token'),
    accessToken: localStorage.getItem('access_token'),
		authLoading: true,
		submitting: false
}

export default function authReducer(state=initialState, action) {
	switch (action.type) {
		case AUTH_REQUEST:
			return {
				...state,
				authLoading: true
			}
		
		case AUTH_SUCCESS:
			return {
				...state,
				authLoading: false,
				user: action.payload,
				isAuth: true
			}
		case AUTH_FAIL:
			return {
				...state,
				authLoading: false,
				user: null,
				isAuth: false
			}
		case START_SUBMIT:
			return {
				...state,
				submitting: true
			}
			case FINISH_SUBMIT:
				return {
					...state,
					submitting: false
				}
		default:
				return state
	}
}
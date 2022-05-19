import {
    AUTH_REQUEST,
    AUTH_SUCCESS,
    AUTH_FAIL,
    USER_REQUEST,
    USER_SUCCESS,
    USER_FAIL,
} from './authActionTypes'

const initialState = {
    user: null,
    isAuth: false,
    refreshToken: localStorage.getItem('refresh_token'),
    accessToken: localStorage.getItem('access_token'),
		authLoading: true
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

		default:
				return state
	}
}
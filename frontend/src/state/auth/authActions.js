import { axiosInstance } from '../../axios'
import {
    AUTH_REQUEST,
    AUTH_SUCCESS,
    AUTH_FAIL,
    START_SUBMIT,
    FINISH_SUBMIT,
} from './authActionTypes'

function authRequest() {
	return {
		type: AUTH_REQUEST,
	}
}

function authSuccess(user) {
	return {
		type: AUTH_SUCCESS,
		payload: user
	}
}

function authFail() {
	return {
		type: AUTH_FAIL
	}
}

export function checkAuth() {
	return async function getAuth(dispatch, getState) {
		dispatch(authRequest())
		try {
			const response = await axiosInstance.get('/auth/users/me/')
			dispatch(authSuccess(response.data))
		} catch(e) {
			dispatch(authFail())
		}
	}
}

export function startSubmit() {
	return {
		type: START_SUBMIT
	}
}

export function finishSubmit() {
	return {
		type: FINISH_SUBMIT
	}
}
import axios from 'axios'
import moment from 'moment'

const apiUrl = process.env.REACT_APP_API_URL;

export const axiosInstance = axios.create({
  baseURL: apiUrl,
	timeout: 5000,
	headers: {
		'Authorization': `JWT ${localStorage.getItem('access_token')}`,
		'Content-Type': 'application/json',
	}
});

export const axiosUnauthInstance = axios.create({
	baseURL: apiUrl,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
	}
});

axiosInstance.interceptors.request.use(async function (config){
	let accessToken = localStorage.getItem('access_token');

	if (accessToken) {
		let accessData = JSON.parse(atob(accessToken.split('.')[1]))
		if (moment().isBefore(moment.unix(accessData.exp))) return config;
	}
	
	let refreshToken = localStorage.getItem('refresh_token');
	if (refreshToken) {
		let refreshData = JSON.parse(atob(refreshToken.split('.')[1]))
		if (moment().isBefore(moment.unix(refreshData.exp))) {
			let data = {
				refresh: refreshToken
			}
			await axios.post(`${apiUrl}auth/jwt/refresh/`, data)
			.then(response => {
				const newAccess = response.data.access;
				const newRefresh = response.data.refresh;

				localStorage.setItem('access_token', newAccess);
				localStorage.setItem('refresh_token', newRefresh);
				axiosInstance.defaults.headers['Authorization'] = `JWT ${newAccess}`				
				config.headers['Authorization'] = `JWT ${newAccess}`
			})
			.catch(error => {
				config.headers['Authorization'] = `JWT ${null}`
				axiosInstance.config.headers['Authorization'] = `JWT ${null}`
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token')				
				return Promise.reject(error);
			})
		}
	}

	return config
}, function(error) {
	return Promise.reject(error);
});


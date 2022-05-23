import React, { useEffect } from 'react'
import { axiosInstance, axiosUnauthInstance } from '../axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { checkAuth } from '../state/auth/authActions';

const LogoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleLogout() {
    await axiosUnauthInstance.post('/auth/jwt/blacklist/', {refresh: localStorage.getItem('refresh_token')})
      .catch(error => console.log(error.response))
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    axiosInstance.defaults.headers['Authorization'] = `JWT ${null}`
    dispatch(checkAuth());
    navigate('/')
  }

  useEffect(() => {
    handleLogout()
  }, [])

  return (
    <main className="page">
			loggin out
		</main>
  )
}

export default LogoutPage
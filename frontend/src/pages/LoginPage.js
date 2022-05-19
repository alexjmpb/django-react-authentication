import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { axiosInstance, axiosUnauthInstance } from '../axios'
import { checkAuth } from '../state/auth/authActions'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
  })

  function handleChange(e) {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    await axiosUnauthInstance.post('/auth/jwt/', userInfo)
      .then(response => {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        axiosInstance.defaults.headers['Authorization'] = `JWT ${response.data.access}`
        navigate('/')
      })
  }
  
  return (
    <main className="page">
      <header className="page__header">
        <h1 className="page__tile">Login</h1>
      </header>
      <section>
        <form 
          className="form"
          onSubmit={handleSubmit}
        >
          <input type="username" className="input" name="username" onChange={handleChange}/>
          <input type="password" className="input" name="password" onChange={handleChange}/>
          <input type="submit" value="Login"/>
        </form>
      </section>
    </main>
  )
}

export default LoginPage
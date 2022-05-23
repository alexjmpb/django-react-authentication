import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { axiosInstance, axiosUnauthInstance } from '../axios'
import { finishSubmit, startSubmit } from '../state/auth/authActions'
import Input from '../components/input/Input'
import Form from '../components/form/Form'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    username: '',
    password: '',
  })
  const [validators, setValidators] = useState([])
  const submitting = useSelector(state => state.auth.submitting)

  function handleChange(e) {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault();

    dispatch(startSubmit());
    await axiosUnauthInstance.post('/auth/jwt/', userInfo)
      .then(response => {
        dispatch(finishSubmit());
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        axiosInstance.defaults.headers['Authorization'] = `JWT ${response.data.access}`;
        navigate('/')
      })
      .catch(error => {
        dispatch(finishSubmit());
        setValidators(error.response.data);
      })
  }
  
  return (
    <main className="page">
      <div className="container">
        <header className="container__header">
          <h1 className="container__tile">Login</h1>
        </header>
        <section>
          <Form 
            className="form"
            onSubmit={handleSubmit}
            validators={validators}
          >
            <Input type="username" className="input" placeholder="Username" name="username" onChange={handleChange} validators={validators}/>
            <Input type="password" className="input" placeholder="Password" name="password" onChange={handleChange} validators={validators}/>
            <input type="submit" value="Login" disabled={submitting}/>
          </Form>
          <ul className="auth-links">
            <li>
              <Link to="/register/" className="link">Don't have an account yet? Create one here!</Link>
            </li>
            <li>
              <Link to="/reset/" className="link">Forgot password?</Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  )
}

export default LoginPage
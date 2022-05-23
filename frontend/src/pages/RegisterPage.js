import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { axiosUnauthInstance } from '../axios'
import Form from '../components/form/Form'
import Input from '../components/input/Input'
import { finishSubmit, startSubmit } from '../state/auth/authActions'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
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
    await axiosUnauthInstance.post('/auth/users/', userInfo)
      .then(response => {
        dispatch(finishSubmit());
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
          <h1 className="container__tile">Register</h1>
        </header>
        <section>
          <Form 
            className="form"
            onSubmit={handleSubmit}
            validators={validators}
          >
            <Input type="username" className="input" name="username" placeholder="Username" onChange={handleChange} validators={validators}/>
            <Input type="email" className="input" name="email" placeholder="Email" onChange={handleChange} validators={validators}/>
            <Input type="password" className="input" name="password" placeholder="Password" onChange={handleChange} validators={validators}/>
            <Input type="password" className="input" name="re_password" placeholder="Repeat Password" onChange={handleChange} validators={validators}/>
            <input type="submit" value="Register" disabled={submitting}/>
          </Form>
          <Link to="/login/" className="link">Already have an account?</Link>
        </section>
      </div>
    </main>
  )
}

export default RegisterPage
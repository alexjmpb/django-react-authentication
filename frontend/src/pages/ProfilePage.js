import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../axios'
import Form from '../components/form/Form'
import Input from '../components/input/Input'
import { checkAuth, finishSubmit, startSubmit } from '../state/auth/authActions'

const ProfilePage = () => {
	const user = useSelector(state => state.auth.user)
	const submitting = useSelector(state => state.auth.submitting)
	const [editing, setEditing] = useState(false)
	const [userInfo, setUserInfo] = useState({
		username: user.username,
		email: user.email
	})
	const [validators, setValidators] = useState([])
	const dispatch = useDispatch()

	function handleChange(e) {
		setUserInfo({
			...userInfo,
			[e.target.name]: e.target.value
		})
	}

	function handleEditSubmit(e) {
		e.preventDefault();

		dispatch(startSubmit())
		axiosInstance.patch('/auth/users/me/', userInfo)
			.then(response => {
				dispatch(checkAuth())
				setValidators([])
				dispatch(finishSubmit())
				setEditing(false)
			})
			.catch(error => {
				dispatch(finishSubmit())
				setValidators(error.response.data)
			})
	}

  return (
    <main className="page">
			<div className="container">
				<div className="container__header">
					<h2 className="container__title">
						Profile
					</h2>
					<button className="button" onClick={() => setEditing(!editing)}>Edit</button>
				</div>
				<div className="container__body">
					{
						editing ?
							<Form
							className="form"
							onSubmit={handleEditSubmit}
							>
								<Input name="username" className="input" validators={validators} placeholder="Username" onChange={handleChange} value={userInfo.username}/>
								<Input name="email" className="input" validators={validators} placeholder="Email" onChange={handleChange} value={userInfo.email}/>
								<input type="submit" disabled={submitting}/>
							</Form>
						:
						<>
							<h3>{user.username}</h3>
							<p>{user.email}</p>
							<Link to="change_password/" className="link"><button className="button">Change password</button></Link>
						</>
					}
				</div>
			</div>
		</main>
  )
}

export default ProfilePage
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosUnauthInstance } from '../axios';
import Form from '../components/form/Form'
import Input from '../components/input/Input'
import { finishSubmit, startSubmit } from '../state/auth/authActions';

const ResetConfirmPage = () => {
	const [passwordInfo, setPasswordInfo] = useState({
		password: '',
		re_password: ''
	});
	const [validators, setValidators] = useState([]);
	const dispatch = useDispatch();
	const submitting = useSelector(state => state.auth.submitting)
	const params = useParams();
	const id = params.id
	const token = params.token
	const navigate = useNavigate();

	function handleChange(e) {
		setPasswordInfo({
			...passwordInfo,
			[e.target.name]: e.target.value
		})
	}

	function handleSubmit(e) {
		e.preventDefault();

		let data = {
			...passwordInfo,
			user_id: id,
			token: token
		}

		dispatch(startSubmit())
		axiosUnauthInstance.post('/auth/users/reset_password_confirm/', data)
			.then(response => {
				dispatch(finishSubmit())
				setValidators([])
				navigate('/')
			})
			.catch(error => {
				dispatch(finishSubmit())
				setValidators(error.response.data);
			})
	}

  return (
    <main className="page">
			<div className="container">
					<div className="container__header">
						<h2 className="container__title">
							Reset password
						</h2>
					</div>
					<div className="container__body">
						<Form
						onSubmit={handleSubmit}
						className="form"
						validators={validators}
						>
							<Input onChange={handleChange} className="input" name="password" type="password" validators={validators} placeholder="Password"/>
							<Input onChange={handleChange} className="input" name="re_password" type="password" validators={validators} placeholder="Repeat password"/>
							<input type="submit" value="Send" disabled={submitting}/>
						</Form>
					</div>
			</div>
    </main>
  )
}

export default ResetConfirmPage
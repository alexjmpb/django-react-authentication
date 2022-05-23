import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { axiosUnauthInstance } from '../axios';
import Form from '../components/form/Form'
import Input from '../components/input/Input'
import { finishSubmit, startSubmit } from '../state/auth/authActions';

const ResetPage = () => {
	const [email, setEmail] = useState('');
	const [validators, setValidators] = useState([]);
	const dispatch = useDispatch();
	const submitting = useSelector(state => state.auth.submitting)
	const navigate = useNavigate();

	function handleSubmit(e) {
		e.preventDefault();

		dispatch(startSubmit())
		axiosUnauthInstance.post('/auth/users/reset_password/', {email: email})
			.then(response => {
				dispatch(finishSubmit())
				setValidators([])
				navigate('/login/')
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
							<Input onChange={(e) => setEmail(e.target.value)} className="input" name="email" type="email" validators={validators} placeholder="Email"/>
							<input type="submit" value="Send" disabled={submitting}/>
						</Form>
					</div>
			</div>
    </main>
  )
}

export default ResetPage
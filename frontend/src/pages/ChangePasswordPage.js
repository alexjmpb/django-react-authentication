import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../axios';
import Form from '../components/form/Form'
import Input from '../components/input/Input'
import { finishSubmit, startSubmit } from '../state/auth/authActions';

const ChangePasswordPage = () => {
	const [passwordInfo, setPasswordInfo] = useState({
		password: '',
		re_password: '',
        old_password: ''
	});
	const [validators, setValidators] = useState([]);
	const dispatch = useDispatch();
	const submitting = useSelector(state => state.auth.submitting)
	const navigate = useNavigate();

	function handleChange(e) {
		setPasswordInfo({
			...passwordInfo,
			[e.target.name]: e.target.value
		})
	}

	function handleSubmit(e) {
		e.preventDefault();

		dispatch(startSubmit())
		axiosInstance.post('/auth/users/set_password/', passwordInfo)
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
							Change password
						</h2>
					</div>
					<div className="container__body">
						<Form
						onSubmit={handleSubmit}
						className="form"
						validators={validators}
						>
							<Input onChange={handleChange} className="input" name="old_password" type="password" validators={validators} placeholder="Old password"/>
							<Input onChange={handleChange} className="input" name="password" type="password" validators={validators} placeholder="Password"/>
							<Input onChange={handleChange} className="input" name="re_password" type="password" validators={validators} placeholder="Repeat password"/>
							<input type="submit" value="Send" disabled={submitting}/>
						</Form>
					</div>
			</div>
    </main>
  )
}

export default ChangePasswordPage
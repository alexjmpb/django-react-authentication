import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosUnauthInstance } from '../axios';
import Loading from '../components/loading/Loading'

const ConfirmEmail = () => {
  const params = useParams();
	const id = params.id
	const token = params.token
	const navigate = useNavigate()

	async function handleSubmit() {
		await axiosUnauthInstance.post('/auth/users/confirm_email/', {token: token, user_id: id});
	}

	useEffect(() => {
		handleSubmit()
		navigate('/')
	}, [token, id])

  return (
    <Loading/>
  )
}

export default ConfirmEmail
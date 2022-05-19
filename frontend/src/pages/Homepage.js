import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { checkAuth } from '../state/auth/authActions'

const Homepage = () => {
  const dispatch = useDispatch()
	const isAuth = useSelector(state => state.auth.isAuth)
  const loading = useSelector(state => state.auth.loading)

  useEffect(() => {
    dispatch(checkAuth());
  }, [])

  return (
    <div>Homepage {isAuth}</div>
  )
}

export default Homepage
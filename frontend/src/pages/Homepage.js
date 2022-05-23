import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { checkAuth } from '../state/auth/authActions'

const Homepage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkAuth());
  }, [])

  return (
    <main className="page">
      <div className="container">
        <div className="container__header">
          <h2 className="container__title">Homepage</h2>
        </div>
        <div className="container__body">
          <p>This is a public page.</p>
        </div>
      </div>
    </main>
  )
}

export default Homepage
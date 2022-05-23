import React, { useEffect } from 'react'
import {
    Outlet,
} from "react-router-dom";
import Header from '../components/header/Header';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { checkAuth } from '../state/auth/authActions';
import Loading from '../components/loading/Loading'

const PrivateLayot = () => {
  const isAuth = useSelector(state => state.auth.isAuth)
  const loading = useSelector(state => state.auth.authLoading)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(checkAuth())
  }, [])

  useEffect(() => {
    if (isAuth && !loading) {
      navigate('/')
    }
  }, [loading])

  return (
    <>
      <Header/>
      {
        loading ?
        <Loading/>
        :
        <Outlet/>
      }
    </>
  )
}

export default PrivateLayot
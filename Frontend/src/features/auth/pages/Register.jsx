import React , { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import FormInput from '../components/formInput'
import '../style/auth.scss'
import { useSelector } from 'react-redux'
import { useAuth } from '../hook/useAuth'

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from '../validation/auth.schema'

const Register = () => {
  const { handleRegister } = useAuth()
  const { user, loading } = useSelector(state => state.auth)
  const [msg, setMsg] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  })


  const onSubmit = async (data) => {
    const res = await handleRegister(data)
    setMsg(res.message)   
 
 }


  if (!loading && user) {
    return <Navigate to='/' replace />
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">InfraCore AI</h1>
            <p className="auth-subtitle">Create Account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">

            <FormInput
              label="Username"
              type="text"
              placeholder="Choose a username"
              {...register("username")}
              error={errors.username?.message}
            />

            <FormInput
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
            />

            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create'}
            </button>

          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign in
              </Link>
            </p>

            {msg && <p className="auth-message">{msg}</p>}


          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
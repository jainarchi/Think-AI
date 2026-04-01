import React, { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import FormInput from "../components/formInput";
import "../style/auth.scss";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/auth.schema";

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const { user, loading , error , message} = useSelector((state) => state.auth);


  // react-hook-form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });



  const onSubmit = async (data) => {
    await handleLogin(data);

    if (! error) {
      navigate("/"); 
    }
  }

  // already logged in
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>

          {/* ✅ handleSubmit ensures validation runs first */}
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Create one
              </Link>
            </p>

            {error && <p className="auth-message">{error}</p>}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
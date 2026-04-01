import React, { useState, useEffect } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";

import FormInput from "../components/formInput";
import "../style/auth.scss";
import { useAuth } from "../hook/useAuth";
import { useSelector } from "react-redux";

import { clearAuth } from "../auth.slice";
import { useDispatch } from "react-redux";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/auth.schema";



const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleLogin, handleResentVerificationEmail } = useAuth();
  const { user, loading, error, errorCode , message } = useSelector(
    (state) => state.auth,
  );
  const [showResend, setshowResend] = useState(false);
  const [userEmail, setUserEmail] = useState(null);


  // react-hook-form + Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    return () => {
      dispatch(clearAuth());
     
    };
  }, []);




  useEffect(() => {
    if (!loading && !error && user) {
      navigate("/");
    }
  }, [loading, user, error]);


  useEffect(() => {
    if (errorCode === "UNVERIFIED_USER") {
      setshowResend(true);
    }
    else {
      setshowResend(false);
    }
  }, [errorCode]);



  const onSubmit = async (data) => {
    setUserEmail(data.email);
    await handleLogin(data);
  };


  const resendEmail = async () => {
    setshowResend(false);
    await handleResentVerificationEmail(userEmail);
   
  };



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
              {loading && !showResend ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="auth-footer">

            <div className="authResponse">
            {error && <p>{error}</p>}

            {showResend && userEmail && ( 

              <p>Account not verified?{" "} 
              <span className="highlight" onClick={resendEmail}>
                 send email
              </span>
              </p>
            )}

            {message && <p >{message}</p> }

            </div>
           

            <p className="auth-footer-text">
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Create one
              </Link>
            </p>

          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

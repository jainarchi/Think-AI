import { useDispatch } from "react-redux";
import {
  register,
  login,
  getMe,
  logout,
  resentVerificationEmail,
  forgetPassword,
  resetPassword,
} from "../services/auth.api";
import { setUser, setLoading, setError, setMessage } from "../auth.slice";
import { success } from "zod";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({ email, username, password }) {
    try {
      dispatch(setLoading(true))
      const data = await register({ email, username, password });
      console.log(data.message)
      dispatch(setMessage(data.message))


    } catch (err) {
      const error = err.response?.data?.message || "Registration failed";
      console.log(error)
      dispatch(setError(error))
      
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true));
      const data = await login({ email, password });
      console.log(data)
      dispatch(setUser(data.user));

     
    } catch (err) {
        const error = err.response?.data?.message || "Login failed"
        dispatch(setError(error));
        console.log(error)
      
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
    } catch (err) {
    //   dispatch(setError(err.response?.data?.message || "Failed to fetch user"));
    console.log(err.response?.data?.message)
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      await logout();
      dispatch(setUser(null));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Error in logout"));
    } finally {
      dispatch(setLoading(false));
    }
  }


  
  async function handleResentVerificationEmail(email) {
    try {
      dispatch(setLoading(true));
      const data = await resentVerificationEmail({ email });
      console.log(data.message);
      dispatch(setMessage(data.message));

    } catch (err) {

      const error =
        err.response?.data?.message || "Failed to resent verification email";
      dispatch(setError(error));
      
    } finally {
      dispatch(setLoading(false));
    }
  }







  return {
    handleRegister,
    handleLogin,
    handleGetMe,
    handleLogout,
    handleResentVerificationEmail,
  };
};

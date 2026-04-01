import { useDispatch } from "react-redux";
import {
  register,
  login,
  getMe,
  logout,
  resentVerificationEmail,
 
} from "../services/auth.api";
import { setUser, setLoading, setError, setMessage , setErrorCode } from "../auth.slice";

export const useAuth = () => {
  const dispatch = useDispatch();

  async function handleRegister({ email, username, password }) {
    try {
      dispatch(setLoading(true))
      const data = await register({ email, username, password });
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
      dispatch(setUser(data.user));

     
    } catch (err) {
        const error = err.response?.data?.message || "Login failed"
        dispatch(setError(error));

         const errorCode = err.response?.data?.errorCode || null;
         dispatch(setErrorCode(errorCode))
         console.log(errorCode)
      
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
    // console.log(err.response?.data?.message)
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

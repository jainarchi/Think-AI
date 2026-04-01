import axios from "axios";



const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL:BASE_URL,
  withCredentials: true,
});




export async function register({ username, email, password }) {
  const response = await api.post("/api/auth/register", { username, email, password });
  return response.data;
}

export async function login({ email, password }) {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
}



export async function getMe() {
  const response = await api.get("/api/auth/get-me");
  return response.data;
}


export async function logout() {
  const response = await api.post("/api/auth/logout");
  return response.data;
}

export async function resentVerificationEmail({ email }) {
  const response = await api.post("/api/auth/resend-verification", { email });
  return response.data;
}



export async function forgetPassword({ email }) {
  const response = await api.post("/api/auth/forget-password", { email });
  return response.data;
}



export async function resetPassword({ newPassword }) {
  const response = await api.post(`/api/auth/reset-password?token=${token}`, {
    newPassword,
  });
  return response.data;
}

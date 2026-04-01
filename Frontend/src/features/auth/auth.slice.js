import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: null,
    loading: true,
    error: null,
    message: null,
    errorCode: null
  },

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.message = null;
      state.error = action.payload;
    },
    setMessage: (state, action) => {
      state.error = null;
      state.message = action.payload;
    },
    

  clearAuth: (state) => {
    state.error = null;
    state.message = null;
  },
   setErrorCode: (state, action) => {
    state.errorCode = action.payload;
  
  }

 
}
});

export const { setUser, setLoading, setError, setMessage , clearAuth , setErrorCode } = authSlice.actions;

export default authSlice.reducer;

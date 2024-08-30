import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: localStorage.getItem('userToken') ? true : false,
};

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      localStorage.setItem('userToken', action.payload.token);
      console.log("action : ", action)
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logout: (state, action) => {
      localStorage.removeItem('userToken');
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
});

export const { loginSuccess, logout } = userAuthSlice.actions;
export default userAuthSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { IAuthState } from '../../interfaces/interfaces';

const initialState: IAuthState = {
  user: null,
  token: null,
  loading: true
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'user',
  initialState: {
    name: '',
  },
  reducers: {
    updateUser(state, { payload }) {
      return { ...state, name: payload };
    },
    logout(state) {
      return { ...state, name: '' };
    },
  },
});

export const { updateUser, logout } = slice.actions;

export const selectUser = (state: any) => state.user;

export default slice.reducer;

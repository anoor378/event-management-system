import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage, removeFromStorage } from '../../utils/storage';

const USERS_KEY = 'em_users';
const CURRENT_USER_KEY = 'em_current_user';

const savedUser = loadFromStorage(CURRENT_USER_KEY, null);

const initialState = {
  user: savedUser,
  users: loadFromStorage(USERS_KEY, []),
  isAuthenticated: !!savedUser,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register(state, action) {
      const { name, email, password } = action.payload;
      const exists = state.users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (exists) {
        state.error = 'This email is already registered';
        return;
      }
      const newUser = { id: Date.now().toString(), name, email, password };
      state.users.push(newUser);
      saveToStorage(USERS_KEY, state.users);

      const safeUser = { id: newUser.id, name, email };
      state.user = safeUser;
      state.isAuthenticated = true;
      state.error = null;
      saveToStorage(CURRENT_USER_KEY, safeUser);
    },
    login(state, action) {
      const { email, password } = action.payload;
      const found = state.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) {
        state.error = 'Invalid email or password';
        return;
      }
      const safeUser = { id: found.id, name: found.name, email: found.email };
      state.user = safeUser;
      state.isAuthenticated = true;
      state.error = null;
      saveToStorage(CURRENT_USER_KEY, safeUser);
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      removeFromStorage(CURRENT_USER_KEY);
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { register, login, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
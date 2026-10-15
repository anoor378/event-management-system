import { createSlice } from '@reduxjs/toolkit';
import { loadFromStorage, saveToStorage } from '../../utils/storage';

const REG_KEY = 'em_registrations';

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState: {
    items: loadFromStorage(REG_KEY, []),
  },
  reducers: {
    registerForEvent(state, action) {
      const { userId, eventId, snapshot } = action.payload;
      const exists = state.items.some(
        (r) => r.userId === userId && r.eventId === eventId
      );
      if (exists) return;
      state.items.push({
        userId,
        eventId,
        registeredAt: new Date().toISOString(),
        eventSnapshot: snapshot,
      });
      saveToStorage(REG_KEY, state.items);
    },
    cancelRegistration(state, action) {
      const { userId, eventId } = action.payload;
      state.items = state.items.filter(
        (r) => !(r.userId === userId && r.eventId === eventId)
      );
      saveToStorage(REG_KEY, state.items);
    },
  },
});

export const { registerForEvent, cancelRegistration } = registrationsSlice.actions;

export const selectIsRegistered = (userId, eventId) => (state) =>
  !!userId &&
  state.registrations.items.some((r) => r.userId === userId && r.eventId === eventId);

export const selectUserRegistrations = (userId) => (state) =>
  state.registrations.items.filter((r) => r.userId === userId);

export default registrationsSlice.reducer;
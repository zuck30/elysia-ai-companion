import { configureStore } from '@reduxjs/toolkit';
import elysiaReducer from './elysiaSlice';

export const store = configureStore({
  reducer: {
    elysia: elysiaReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import userSlice from './store';

const store = configureStore({
  reducer: { user: userSlice.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

export default store;

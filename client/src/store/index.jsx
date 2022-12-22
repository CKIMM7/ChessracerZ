import { configureStore } from '@reduxjs/toolkit';

import userSlice from './store';

const store = configureStore({
  reducer: { user: userSlice.reducer }
});

export default store;

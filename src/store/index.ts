import { configureStore } from '@reduxjs/toolkit';

import uiSlice, { UiState } from './ui-slice';
import configSlice from './config-slice';
import currentImageSlice from './current-image-slice';
import persistentStorage from '../persistentStorage';

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    config: configSlice.reducer,
    currentImage: currentImageSlice.reducer,
  },
});

store.subscribe(() => {
  persistentStorage.set('uiState', store.getState().ui);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

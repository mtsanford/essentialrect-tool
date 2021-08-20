import { configureStore } from '@reduxjs/toolkit';

import uiSlice from './ui-slice';
import configSlice from '/ui-slice;';
import currentImageSlice from './current-image-slice';

const store = configureStore({
  reducer: {
    ui: uiSlice.reducer,
    config: configSlice.reducer,
    currentImage: currentImageSlice.reducer,
  },
});

export default store;

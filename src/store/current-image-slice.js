import { createSlice } from '@reduxjs/toolkit';

const currentImageSlice = createSlice({
  name: 'currentImage',
  initialState: {
    filePath: null,
    imageRect: null,
    essentialRect: null,
    isValid: false,
  },
  reducers: {
    setImage(state, action) {
      state.filePath = action.payload.filePath;
      state.imageRect = action.payload.imageRect;
      state.essentialRect =
        action.payload.essentialRect || action.payload.imageRect;
      state.isValid = true;
    },
    setEssentialRect(state, action) {
      state.essentialRect = action.payload;
    }
  },
});

export const currentImageActions = currentImageSlice.actions;

export default currentImageSlice;

import { createSlice } from '@reduxjs/toolkit';

const currentImageSlice = createSlice({
  name: 'ui',
  initialState: {
    filePath: 'D:/Media/China2015/20150303_102929.jpg',
    imageRect: { left: 0, top: 0, width: 2560, height: 1920 },
    essentialRect: { left: 1480, top: 0, width: 1080, height: 1520 },
    isValid: true,
  },
  reducers: {
    setImage(state, action) {
      state.filePath = action.payload.filePath;
      state.imageRect = action.payload.imageRect;
      state.essentialRect =
        action.payload.essentialRect || action.payload.imageRect;
      state.isValid = true;
    },
  },
});

export const currentImageActions = currentImageSlice.actions;

export default currentImageSlice;

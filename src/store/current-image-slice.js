import { createSlice } from '@reduxjs/toolkit';

const currentImageSlice = createSlice({
  name: 'ui',
  initialState: {
    filePath: 'D:/Media/China2015/20150303_102929.jpg',
    imageRect:  { left: 0, top: 0, width: 2560, height: 1920 },
    essentialRect: { left: 0, top: 0, width: 2560, height: 1920 },
  },
  reducers: {
    setImage(state, action) {
      state.filePath = action.payload.filePath;
      state.imageRect = action.payload.imageRect;
      state.essentialRect = action.payload.essentialRect;
    },
  },
});

export const currenImageActions = currentImageSlice.actions;

export default currentImageSlice;

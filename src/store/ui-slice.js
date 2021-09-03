import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    notification: null,
    previewColumns: 2,
  },
  reducers: {
    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      };
    },
    setPreviewColumns(state, action) {
      state.previewColumns = action.payload;
    }
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice;

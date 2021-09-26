import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import persistentStorage from '../persistentStorage';

export interface Notification {
  status: string;
  title: string;
  message: string;
}

export interface UiState {
  notification?: Notification;
  previewColumns: number;
  constrain: boolean;
}

const initialState = persistentStorage.get('uiState', {
  previewColumns: 2,
  constrain: false,
}) as UiState;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showNotification(state, action: PayloadAction<Notification>) {
      state.notification = action.payload;
    },
    setPreviewColumns(state, action: PayloadAction<number>) {
      state.previewColumns = action.payload;
    },
    setConstrain(state, action: PayloadAction<boolean>) {
      state.constrain = action.payload;
    },
  },
});

// For use in useAppDispatch() hook
export const uiActions = uiSlice.actions;

// For use in useAppSelector() hook
export const selectPreviewColumns = (state: RootState) =>
  state.ui.previewColumns;
export const selectConstrain = (state: RootState) => state.ui.constrain;

export default uiSlice;

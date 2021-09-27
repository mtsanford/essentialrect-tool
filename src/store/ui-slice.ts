import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import persistentStorage from '../persistentStorage';

const MIN_ASPECT_RATIO = 0.001;
const MAX_ASPECT_RATIO = 1000;

export interface Notification {
  status: string;
  title: string;
  message: string;
}

export interface UiState {
  notification?: Notification;
  previewColumns: number;
  constrain: boolean;
  lowerConstraintID?: string;
  upperConstraintID?: string;
  lowerConstraint: number;
  upperConstraint: number;
}

const initialState = persistentStorage.get('uiState', {
  previewColumns: 2,
  constrain: false,
  lowerConstraint: MAX_ASPECT_RATIO,
  upperConstraint: MIN_ASPECT_RATIO,
});

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
    setLowerConstraint(
      state,
      action: PayloadAction<{ id?: string; aspectRatio?: number }>
    ) {
      state.lowerConstraintID = action.payload.id;
      state.lowerConstraint = action.payload.aspectRatio || MAX_ASPECT_RATIO;
    },
    setUpperConstraint(
      state,
      action: PayloadAction<{ id?: string; aspectRatio?: number }>
    ) {
      state.upperConstraintID = action.payload.id;
      state.upperConstraint = action.payload.aspectRatio || MIN_ASPECT_RATIO;
    },
  },
});

// For use in useAppDispatch() hook
export const uiActions = uiSlice.actions;

// For use in useAppSelector() hook
export const selectPreviewColumns = (state: RootState) =>
  state.ui.previewColumns;
export const selectConstrain = (state: RootState) => state.ui.constrain;
export const selectLowerConstraintID = (state: RootState) =>
  state.ui.lowerConstraintID;
export const selectUpperConstraintID = (state: RootState) =>
  state.ui.upperConstraintID;
export const selectLowerConstraint = (state: RootState) =>
  state.ui.lowerConstraint;
export const selectUpperConstraint = (state: RootState) =>
  state.ui.upperConstraint;

export default uiSlice;

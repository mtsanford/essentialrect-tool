import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import { Rect } from '../model/Rect';

export interface CurrentImageState {
  filePath?: string;
  imageRect?: Rect;
  essentialRect?: Rect;
  isValid: boolean;
}

export interface SetImageRecord {
  filePath: string;
  imageRect: Rect;
  essentialRect?: Rect;
}

const initialState: CurrentImageState = {
  isValid: false,
};

const currentImageSlice = createSlice({
  name: 'currentImage',
  initialState,
  reducers: {
    setImage(state, action: PayloadAction<SetImageRecord>) {
      state.filePath = action.payload.filePath;
      state.imageRect = action.payload.imageRect;
      state.essentialRect =
        action.payload.essentialRect || action.payload.imageRect;
      state.isValid = true;
    },
    setEssentialRect(state, action) {
      state.essentialRect = action.payload;
    },
  },
});

// For use in useAppDispatch() hook
export const currentImageActions = currentImageSlice.actions;

// For use in useAppSelector() hook
export const selectCurrentImage = (state: RootState) => state.currentImage;

export default currentImageSlice;

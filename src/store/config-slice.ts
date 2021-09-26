import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './index';
import AspectRatio from '../model/AspectRatio';
import persistentStorage from '../persistentStorage';

export interface ConfigState {
  aspectRatios: AspectRatio[];
}

const defaultConfigState: ConfigState = {
  aspectRatios: [
    {
      name: 'HD - iPhone 6/7/8',
      ratioText: '(16:9)',
      aspectRatio: 16 / 9,
      id: '16:9',
      enabled: true,
    },
    {
      name: 'HD - iPhone 6/7/8',
      ratioText: '(9:16)',
      aspectRatio: 9 / 16,
      id: '(9:16)',
      enabled: true,
    },
    {
      name: 'Square',
      ratioText: '(1:1)',
      aspectRatio: 1,
      id: '(1:1)',
      enabled: true,
    },
    {
      name: 'iPad',
      ratioText: '(4:3)',
      aspectRatio: 4 / 3,
      id: '(4:3)',
      enabled: true,
    },
    {
      name: 'iPhone 11/12',
      ratioText: '(19.5:9)',
      aspectRatio: 19.5 / 9,
      id: '(19.5:9)',
      enabled: true,
    },
    {
      name: 'iPhone 11/12',
      ratioText: '(9:19.5)',
      aspectRatio: 9 / 19.5,
      id: '(9:19.5)',
      enabled: true,
    },
    {
      name: 'Social Media Portrait',
      ratioText: '(4:5)',
      aspectRatio: 4 / 5,
      id: '(4:5)',
      enabled: true,
    },
    {
      name: 'Social Media',
      ratioText: '(1.91:1)',
      aspectRatio: 1.91,
      id: '(1.91:1)',
      enabled: true,
    },
  ],
};

const initialState = persistentStorage.get(
  'configState',
  defaultConfigState
) as ConfigState;

// {id: string; value: boolean}

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setEnabledAspectRatio(
      state,
      action: PayloadAction<{ id: string; value: boolean }>
    ) {
      const aspectRatio = state.aspectRatios.find(
        (ar) => ar.id === action.payload.id
      );
      if (aspectRatio) {
        aspectRatio.enabled = action.payload.value;
      }
    },
  },
});

export const configActions = configSlice.actions;

export const selectAspectRatios = (state: RootState) =>
  state.config.aspectRatios;

export default configSlice;

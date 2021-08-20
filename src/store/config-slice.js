import { createSlice } from '@reduxjs/toolkit';

const configSlice = createSlice({
  name: 'configSlice',
  initialState: {
    aspectRatios: [
      {
        name: 'iPhone 11/12 Landscape',
        ratioText: '19.5:9',
        ratio: 19.5 / 9.0,
        enabled: true,
        id: 'ar1',
      },
      {
        name: 'HDTV',
        ratioText: '16:9',
        ratio: 16.0 / 9.0,
        enabled: true,
        id: 'ar2',
      },
      {
        name: 'Square',
        ratioText: '1:1',
        ratio: 1.0,
        enabled: true,
        id: 'ar3',
      },
      {
        name: 'HTDV Portrait',
        ratioText: '9:16',
        ratio: 9.0 / 16.0,
        enabled: true,
        id: 'ar4',
      },
      {
        name: 'iPhone 11/12 Portrait',
        ratioText: '9:19.5',
        ratio: 9.0 / 19.5,
        enabled: true,
        id: 'ar5',
      },
    ],
  },
  reducers: {
    enableAspectRatio(state, action) {
    },
  },
});

export const configActions = configSlice.actions;

export default configSlice;

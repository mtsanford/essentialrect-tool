import { useReducer } from 'react';
import { shuffleArray } from '../lib/util';

// Encapsulates the behaviour of a shuffled list, and window of items within that list.
// Operations:
//  setlist
//  nextbunch
//  previousbunch

const listReducer = (state, action) => {
  const getBunch = (fullList, shuffleIndex, bunchSize, offset) => {
    return Array(bunchSize)
      .fill(null)
      .map((_, i) => fullList[shuffleIndex[i + offset]] || '');
  };

  switch (action.type) {
    case 'setlist': {
      const shuffleIndex = Array(action.list.length)
        .fill(null)
        .map((_, i) => i);
      shuffleArray(shuffleIndex);

      return {
        fullList: action.list,
        shuffleIndex: shuffleIndex,
        currentBunch: getBunch(action.list, shuffleIndex, state.bunchSize, 0),
        bunchSize: state.bunchSize,
        offset: 0,
      };
    }
    case 'nextbunch':
    case 'previousbunch': {
      let newTargetOffset;
      let newOffset;

      if (action.type === 'nextbunch') {
        newTargetOffset = state.offset + state.bunchSize;
        newOffset =
          newTargetOffset >= state.fullList.length ? 0 : newTargetOffset;
      }
      if (action.type === 'previousbunch') {
        newTargetOffset = state.offset - state.bunchSize;
        newOffset = newTargetOffset < 0 ? 0 : newTargetOffset;
      }

      return {
        fullList: state.fullList,
        shuffleIndex: state.shuffleIndex,
        currentBunch: getBunch(
          state.fullList,
          state.shuffleIndex,
          state.bunchSize,
          newOffset
        ),
        bunchSize: state.bunchSize,
        offset: newOffset,
      };
    }
    default:
      return state;
  }
};

const useListReducer = (bunchSize = 16) => {
  const defaultListState = {
    fullList: [],
    shuffleIndex: [],
    currentBunch: Array(bunchSize).fill(''),
    bunchSize,
    offset: 0,
  };

  return useReducer(listReducer, defaultListState);
};

export default useListReducer;

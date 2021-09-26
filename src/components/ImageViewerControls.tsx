import React, { useCallback } from 'react';
import { Rect, rectEmpty } from '../model/Rect';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectConstrain, uiActions } from '../store/ui-slice';

import HappyButton from './UI/HappyButton';
import maximizeIcon from '../../assets/icons/maximize.svg';
import constrainIcon from '../../assets/icons/crop.svg';

// import { selectCurrentImage } from '../store/current-image-slice';

const ImageViewerControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const constrain = useAppSelector(selectConstrain);

  const resetClicked = useCallback(() => {
    console.log('reset clicked');
  }, [constrain, dispatch]);

  const constrainClicked = useCallback(() => {
    console.log('constrain clicked', constrain);
    dispatch(uiActions.setConstrain(!constrain));
  }, [constrain, dispatch]);

  return (
    <div className="image-viewer-controls">
      <HappyButton onClick={resetClicked} token="reset">
        <img src={maximizeIcon} alt="" className="svg-button" title="reset" />
      </HappyButton>

      <HappyButton
        onClick={constrainClicked}
        isSlave
        depressed={constrain}
        token="constrain"
      >
        <img
          src={constrainIcon}
          alt=""
          className="svg-toggle-button"
          title="constrain essentialRect"
        />
      </HappyButton>
    </div>
  );
};

export default ImageViewerControls;

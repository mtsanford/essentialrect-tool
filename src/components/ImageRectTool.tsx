import React, { useEffect, useCallback } from 'react';

import ImageViewer from './ImageViewer';
import ImageViewerControls from './ImageViewerControls';
import ImageViewerInfo from './ImageViewerInfo';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  selectConstrain,
  selectLowerConstraint,
  selectUpperConstraint,
} from '../store/ui-slice';
import {
  currentImageActions,
  selectCurrentImage,
} from '../store/current-image-slice';

const ImageRectTool = () => {
  const dispatch = useAppDispatch();
  const constrain = useAppSelector(selectConstrain);
  const lowerConstraint = useAppSelector(selectLowerConstraint);
  const upperConstraint = useAppSelector(selectUpperConstraint);
  const { filePath, essentialRect, imageRect } = useAppSelector(
    selectCurrentImage
  );

  let maxWidth = 0;
  let maxHeight = 0;

  if (imageRect) {
    maxWidth = constrain
      ? Math.min(imageRect.width, imageRect.height * lowerConstraint)
      : imageRect.width;
    maxHeight = constrain
      ? Math.min(imageRect.height, imageRect.width / upperConstraint)
      : imageRect.height;
  }

  const resetEssentialRect = useCallback(() => {
    if (imageRect) {
      const newEssentialRect = {
        left: (imageRect.width - maxWidth) / 2,
        top: (imageRect.height - maxHeight) / 2,
        width: maxWidth,
        height: maxHeight,
      };
      dispatch(currentImageActions.setEssentialRect(newEssentialRect));
    }
  }, [imageRect, maxWidth, maxHeight, dispatch]);

  const resetHandler = useCallback(() => {
    resetEssentialRect();
  }, [resetEssentialRect]);

  useEffect(() => {
    resetEssentialRect();
  }, [imageRect, maxWidth, maxHeight, resetEssentialRect]);

  const setEssentialRect = (newEssentialRect) => {
    dispatch(currentImageActions.setEssentialRect(newEssentialRect));
  };

  return (
    <div className="image-rect-tool">
      <ImageViewerControls onReset={resetHandler} />
      <ImageViewer
        filePath={filePath}
        essentialRect={essentialRect}
        imageRect={imageRect}
        maxWidth={maxWidth}
        maxHeight={maxHeight}
        setEssentialRect={setEssentialRect}
      />
      <ImageViewerInfo />
    </div>
  );
};

export default ImageRectTool;

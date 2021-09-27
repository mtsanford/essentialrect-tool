import React, { useEffect } from 'react';

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

  const maxWidth = 0;
  const maxHeight = 0;

  const resetHandler = () => {
    console.log('reset clicked');
  };

  useEffect(() => {
    // presuming imageRect changes iff we get a new image
    if (imageRect) {
      console.log('lowerConstraint', lowerConstraint);
      console.log('upperConstraint', upperConstraint);
      console.log('imageRect', imageRect);
      const maxWidth = Math.min(
        imageRect.width,
        imageRect.height * lowerConstraint
      );
      const maxHeight = Math.min(
        imageRect.height,
        imageRect.width / upperConstraint
      );

      const newEssentialRect = {
        left: (imageRect.width - maxWidth) / 2,
        top: (imageRect.height - maxHeight) / 2,
        width: maxWidth,
        height: maxHeight,
      };

      console.log('newEssentialRect', newEssentialRect);

      dispatch(currentImageActions.setEssentialRect(newEssentialRect));
    }
  }, [imageRect, upperConstraint, lowerConstraint, dispatch]);

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

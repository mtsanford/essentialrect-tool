import React, { CSSProperties, useEffect } from 'react';

import ReactCrop, { Crop } from 'react-image-crop';

import { pathToUrl } from '../lib/util';
import { Rect, rectEmpty, rectClip, emptyRect } from '../model/Rect';
import {
  fitRect,
  clientToImageRect,
  imageToClientRect,
} from '../lib/fit-essential-rect';
import {
  currentImageActions,
  selectCurrentImage,
} from '../store/current-image-slice';

import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  selectConstrain,
  selectLowerConstraint,
  selectUpperConstraint,
  uiActions,
} from '../store/ui-slice';
import { selectAspectRatios } from '../store/config-slice';

import useClientRect from '../hooks/use-client-rect';

const stylesFromRect = (rect: Rect): CSSProperties => ({
  left: `${rect.left}px`,
  top: `${rect.top}px`,
  width: `${rect.width}px`,
  height: `${rect.height}px`,
});

const cropImageStyles: CSSProperties = { width: '100%' };

const ImageViewer: React.FC = () => {
  let crop: Partial<Crop> = { width: 10, height: 10 };
  let cropWrapperStyles: CSSProperties = {};
  let cropStyles: CSSProperties = {};
  let cropWrapperRect: Rect = emptyRect;
  let essentialRectClient: Rect;

  const dispatch = useAppDispatch();
  const [imageViewerRef, clientRect] = useClientRect();
  const { filePath, imageRect, essentialRect } = useAppSelector(
    selectCurrentImage
  );
  const constrain = useAppSelector(selectConstrain);
  const lowerConstraint = useAppSelector(selectLowerConstraint);
  const upperConstraint = useAppSelector(selectUpperConstraint);

  const imageUrl = pathToUrl(filePath);

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
      }

      console.log('newEssentialRect' ,newEssentialRect);

      dispatch(currentImageActions.setEssentialRect(newEssentialRect));
    }
  }, [imageRect, upperConstraint, lowerConstraint, dispatch]);

  // we can determine where image should be placed until we have clientrect
  // and an image rect.  We can't draw the crop until we have an essentialRect.
  const drawCropWrapper = imageRect && !rectEmpty(clientRect);
  const drawCrop = drawCropWrapper && essentialRect;

  if (drawCropWrapper) {
    cropWrapperRect = fitRect(imageRect, imageRect, clientRect);
    cropWrapperStyles = stylesFromRect(cropWrapperRect);
    cropWrapperStyles = {
      ...cropWrapperStyles,
      position: 'absolute',
    };

    cropStyles = {
      height: `${cropWrapperRect.height}px`,
    };
  }

  if (drawCrop) {
    essentialRectClient = imageToClientRect(
      imageRect,
      cropWrapperRect,
      essentialRect
    );

    crop = {
      x: essentialRectClient.left - cropWrapperRect.left,
      y: essentialRectClient.top - cropWrapperRect.top,
      width: essentialRectClient.width,
      height: essentialRectClient.height,
      unit: 'px',
    };
  }

  const onCropChange = (newCrop: Crop) => {
    const selectRect: Rect = {
      left: newCrop.x + cropWrapperRect.left,
      top: newCrop.y + cropWrapperRect.top,
      width: newCrop.width,
      height: newCrop.height,
    };

    if (!imageRect) return;

    const newEssentialRect = clientToImageRect(
      imageRect,
      cropWrapperRect,
      selectRect
    );
    const clipped = rectClip(newEssentialRect, imageRect);

    if (!rectEmpty(clipped)) {
      dispatch(currentImageActions.setEssentialRect(clipped));
    }
  };

  return (
    <div className="image-viewer">
      <div className="image-viewer-inner" ref={imageViewerRef}>
        {drawCropWrapper && (
          <div style={cropWrapperStyles}>
            {drawCrop && (
              <ReactCrop
                src={imageUrl}
                crop={crop}
                onChange={onCropChange}
                style={cropStyles}
                imageStyle={cropImageStyles}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;

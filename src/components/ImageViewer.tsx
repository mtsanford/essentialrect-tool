import React, { CSSProperties } from 'react';

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

import { useAppDispatch, useAppSelector } from '../store/hooks';
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
  const { filePath, isValid, imageRect, essentialRect } = useAppSelector(
    selectCurrentImage
  );

  const imageUrl = pathToUrl(filePath);

  // do we have a valid image and rect to draw it in?
  const ready = isValid && !rectEmpty(clientRect);

  if (ready && clientRect && imageRect && essentialRect) {
    cropWrapperRect = fitRect(imageRect, imageRect, clientRect);
    cropWrapperStyles = stylesFromRect(cropWrapperRect);
    cropWrapperStyles = {
      ...cropWrapperStyles,
      position: 'absolute',
    };

    cropStyles = {
      height: `${cropWrapperRect.height}px`,
    };

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
        <div style={cropWrapperStyles}>
          <ReactCrop
            src={imageUrl}
            crop={crop}
            onChange={onCropChange}
            style={cropStyles}
            imageStyle={cropImageStyles}
          />
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;

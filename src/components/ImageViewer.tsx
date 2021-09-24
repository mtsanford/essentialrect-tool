import React, { CSSProperties } from 'react';

import ReactCrop, { Crop } from 'react-image-crop';

import { pathToUrl } from '../lib/util';
import {
  Rect,
  Point,
  rectFromPoints,
  rectEmpty,
  rectClip,
  emptyRect,
  emptyPoint,
} from '../model/Rect';
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
  let renderedImageRect: Rect;
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
    renderedImageRect = fitRect(imageRect, imageRect, clientRect);
    const imageClientRect = stylesFromRect(renderedImageRect);
    cropWrapperStyles = {
      ...imageClientRect,
      position: 'absolute',
    };

    essentialRectClient = imageToClientRect(
      imageRect,
      renderedImageRect,
      essentialRect
    );

    crop = {
      x: essentialRectClient.left - renderedImageRect.left,
      y: essentialRectClient.top - renderedImageRect.top,
      width: essentialRectClient.width,
      height: essentialRectClient.height,
      unit: 'px',
    };
  }

  // let monitorText;

  // if (essentialRect) {
  //   const er = {
  //     left: Math.floor(essentialRect.left),
  //     top: Math.floor(essentialRect.top),
  //     width: Math.floor(essentialRect.width),
  //     height: Math.floor(essentialRect.height),
  //   };
  //   monitorText = JSON.stringify(er);
  // }

  const onCropChange = (newCrop: Crop) => {
    const selectRect: Rect = {
      left: newCrop.x + renderedImageRect.left,
      top: newCrop.y + renderedImageRect.top,
      width: newCrop.width,
      height: newCrop.height,
    };

    if (!imageRect) return;

    const newEssentialRect = clientToImageRect(
      imageRect,
      renderedImageRect,
      selectRect
    );
    const clipped = rectClip(newEssentialRect, imageRect);

    if (!rectEmpty(clipped)) {
      dispatch(currentImageActions.setEssentialRect(clipped));
    }
  };

  return (
    <div className="image-viewer" ref={imageViewerRef}>
      <div style={cropWrapperStyles}>
        <ReactCrop
          src={imageUrl}
          crop={crop}
          onChange={onCropChange}
          imageStyle={cropImageStyles}
        />
      </div>
      {ready && (
        <>
          {/* {essentialRect && (
            <div className="image-viewer-essential-rect-monitor">
              {monitorText}
            </div>
          )}
          <img
            className="image-viewer-image"
            src={imageUrl}
            alt=""
            style={imageStyles}
          /> */}
        </>
      )}
    </div>
  );
};

export default ImageViewer;

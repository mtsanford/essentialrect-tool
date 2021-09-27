import React, { CSSProperties, useEffect } from 'react';

import ReactCrop, { Crop } from 'react-image-crop';

import { pathToUrl } from '../lib/util';
import { Rect, rectEmpty, rectClip, emptyRect } from '../model/Rect';
import {
  fitRect,
  clientToImageRect,
  imageToClientRect,
} from '../lib/fit-essential-rect';

import useClientRect from '../hooks/use-client-rect';

const stylesFromRect = (rect: Rect): CSSProperties => ({
  left: `${rect.left}px`,
  top: `${rect.top}px`,
  width: `${rect.width}px`,
  height: `${rect.height}px`,
});

const cropImageStyles: CSSProperties = { width: '100%' };

const ImageViewer = (props: any) => {
  const {
    filePath,
    imageRect,
    essentialRect,
    maxWidth,
    maxHeight,
    setEssentialRect,
  } = props;

  let crop: Partial<Crop> = { width: 10, height: 10 };
  let cropWrapperStyles: CSSProperties = {};
  let cropStyles: CSSProperties = {};
  let cropWrapperRect: Rect = emptyRect;
  let essentialRectClient: Rect;
  let maxCropWidth;
  let maxCropHeight;

  const [imageViewerRef, clientRect] = useClientRect();

  const imageUrl = pathToUrl(filePath);

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

    const maxRect = {
      left: 0,
      top: 0,
      width: maxWidth,
      height: maxHeight,
    };

    const maxCropRect = imageToClientRect(imageRect, cropWrapperRect, maxRect);
    maxCropWidth = maxCropRect.width;
    maxCropHeight = maxCropRect.height;

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
      setEssentialRect(clipped);
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
                minWidth={32}
                minHeight={32}
                maxWidth={maxCropWidth}
                maxHeight={maxCropHeight}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;

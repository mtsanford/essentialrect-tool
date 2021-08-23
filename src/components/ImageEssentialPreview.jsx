import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { pathToUrl, clipRect, normalizeRect } from '../lib/util';
import { fitRect, clientToImageRect } from '../lib/fit-essential-rect';
import useClientRect from '../hooks/use-client-rect';
import log from '../lib/log';

const imageContainerFit = 0.91; // % of client to fill
const imageContainerBorder = 0.015; // width of border as % of client

function calcImageContainerRect(clientRect, aspectRatio) {
  let imageContainerRect, borderSize;
  if (aspectRatio > 1) {
    const width = clientRect.width * imageContainerFit;
    const height = width / aspectRatio;
    borderSize = clientRect.width * imageContainerBorder;
    imageContainerRect = {
      width: width,
      height: height,
      left: (clientRect.width - width) / 2 - borderSize,
      top: (clientRect.height - height) / 2 - borderSize,
    };
  } else {
    const height = clientRect.height * imageContainerFit;
    const width = height * aspectRatio;
    borderSize = clientRect.height * imageContainerBorder;
    imageContainerRect = {
      height: height,
      width: width,
      top: clientRect.height * imageContainerBorder - borderSize,
      left: (clientRect.width - width) / 2 - borderSize,
    };
  }
  return { imageContainerRect, borderSize };
}

const ImageEssentialPreview = (props) => {
  let imageUrl;
  let imageStyles;
  let containerStyles;
  let imageContainerRect;
  let borderSize;

  const [ref, clientRect] = useClientRect();
  const currentImage = useSelector((state) => state.currentImage);

  const { aspectRatio } = props.aspectRatioInfo;

  const renderContainer = !!clientRect;

  const renderImage = renderContainer && currentImage.isValid;

  if (renderContainer) {
    ({ imageContainerRect, borderSize } = calcImageContainerRect(
      clientRect,
      aspectRatio
    ));

    containerStyles = {
      // position: 'absolute',
      left: `${imageContainerRect.left}px`,
      top: `${imageContainerRect.top}px`,
      width: `${imageContainerRect.width}px`,
      height: `${imageContainerRect.height}px`,
      borderWidth: borderSize,
      borderRadius: borderSize,
    };
  }

  if (renderImage) {
    const renderedImageRect = fitRect(
      currentImage.imageRect,
      currentImage.essentialRect,
      normalizeRect(imageContainerRect)
    );

    imageUrl = pathToUrl(currentImage.filePath);

    imageStyles = {
      position: 'absolute',
      left: `${renderedImageRect.left}px`,
      top: `${renderedImageRect.top}px`,
      width: `${renderedImageRect.width}px`,
      height: `${renderedImageRect.height}px`,
    };
  }

  return (
    <div className="image-essential-container" ref={ref}>
      {renderContainer && (
        <div
          className="image-essential-image-container"
          style={containerStyles}
        >
          {renderImage && (
            <img
              className="image-essential-image"
              src={imageUrl}
              alt=""
              style={imageStyles}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ImageEssentialPreview;

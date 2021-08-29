import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

import { pathToUrl, clipRect, normalizeRect } from '../lib/util';
import { fitRect, clientToImageRect } from '../lib/fit-essential-rect';
import useClientRect from '../hooks/use-client-rect';
import log from '../lib/log';
import AspectRatio from '../model/AspectRatio';

const imageContainerFit = 0.91; // % of client to fill
const imageContainerBorder = 0.015; // width of border as % of client
const imageContainerFont = 0.05;

function calcImageContainerRect(clientRect, aspectRatio) {
  let imageContainerRect;
  let borderSize;

  if (aspectRatio > 1) {
    let width = clientRect.width * imageContainerFit;
    if (aspectRatio < 1.3) {
      width *= 0.8;
    }
    const height = width / aspectRatio;
    borderSize = clientRect.width * imageContainerBorder;
    imageContainerRect = {
      width: width,
      height: height,
      left: (clientRect.width - width) / 2 - borderSize,
      top: (clientRect.height - height) / 2 - borderSize,
    };
  } else {
    let height = clientRect.height * imageContainerFit;
    if (aspectRatio > 0.75) {
      height *= 0.5;
    }
    height *= 0.5;
    const width = height * aspectRatio;
    borderSize = clientRect.height * imageContainerBorder;
    imageContainerRect = {
      height,
      width,
      top: clientRect.height * imageContainerBorder - borderSize,
      left: (clientRect.width - width) / 2 - borderSize,
    };
  }
  return { imageContainerRect, borderSize };
}

const ImageEssentialPreview: React.FC<{
  aspectRatioInfo: AspectRatio;
}> = ({ aspectRatioInfo }) => {
  let imageUrl;
  let imageStyles;
  let textStyles;
  let contentStyles = {};
  let contentClasses;
  let containerStyles;
  let imageContainerRect;
  let borderSize;
  let sizeMultiplier;
  let fontSize;

  const imageContainerRef = useRef();
  const [ref, clientRect] = useClientRect();
  const currentImage = useSelector((state) => state.currentImage);

  const { aspectRatio, name: aspectName, ratioText } = aspectRatioInfo;
  const landscape = aspectRatio >= 1;

  const renderContainer = !!clientRect;

  const renderImage = renderContainer && currentImage.isValid;

  if (renderContainer) {
    ({ imageContainerRect, borderSize } = calcImageContainerRect(
      clientRect,
      aspectRatio
    ));

    contentStyles = {
      height: clientRect.width,
    };

    const orientationClass = landscape
      ? 'image-essential-landscape'
      : 'image-essential-portrait';

    contentClasses = `image-essential-grid-item-content ${orientationClass}`;

    if (aspectRatio > 0.9 && aspectRatio < 1.1) {
      sizeMultiplier = imageContainerFit * 0.8;
    } else if (aspectRatio > 0.74 && aspectRatio < 1.34) {
      sizeMultiplier = imageContainerFit * 0.9;
    } else {
      sizeMultiplier = imageContainerFit;
    }

    if (landscape) {
      imageContainerRect = {
        top: 0,
        left: 0,
        width: sizeMultiplier * clientRect.width,
        height: (sizeMultiplier * clientRect.width) / aspectRatio,
      };
    } else {
      imageContainerRect = {
        top: 0,
        left: 0,
        width: sizeMultiplier * clientRect.width * aspectRatio,
        height: sizeMultiplier * clientRect.width,
      };
    }

    borderSize = clientRect.width * imageContainerBorder;

    containerStyles = {
      width: `${imageContainerRect.width}px`,
      height: `${imageContainerRect.height}px`,
      borderWidth: borderSize,
      borderRadius: borderSize,
    };

    fontSize = clientRect.width * imageContainerFont;

    textStyles = {
      fontSize,
    };
  }

  if (renderImage) {
    const renderedImageRect = fitRect(
      currentImage.imageRect,
      currentImage.essentialRect,
      imageContainerRect
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
    <div className="image-essential-grid-item" ref={ref}>
      <div className={contentClasses} style={contentStyles}>
        <div
          className="image-essential-image-container"
          style={containerStyles}
          ref={imageContainerRef}
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
        <div className="image-essential-text" style={textStyles}>
          {`${aspectName} ${ratioText}`}
        </div>
      </div>
    </div>
  );
};

export default ImageEssentialPreview;

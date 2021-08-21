import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { pathToUrl, clipRect, normalizeRect } from '../lib/util';
import { fitRect, clientToImageRect } from '../lib/fit-essential-rect';
import log from '../lib/log';

const ImageEssentialPreview = (props) => {
  let imageUrl;
  let imageStyles;
  let containerStyles;
  let imageContainerRect;

  const [clientRect, setClientRect] = useState(null);
  const imageContainerRef = useRef();
  const imagePath = useSelector((state) => state.currentImage.filePath);
  const imageRect = useSelector((state) => state.currentImage.imageRect);
  const essentialRect = useSelector(
    (state) => state.currentImage.essentialRect
  );

  const { ratio: aspectRatio } = props.aspectRatioInfo;

  const renderContainer = !!clientRect;

  const renderImage =
    renderContainer &&
    imageContainerRef.current &&
    imagePath &&
    imageRect.width > 0 &&
    imageRect.height > 0;


  useEffect(() => {
    const element = imageContainerRef.current;
    const resizeHandler = (entries) => {
      const newClientRect = {
        left: 0,
        top: 0,
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height,
      };

      setClientRect(newClientRect);
    };
    const ro = new ResizeObserver(resizeHandler);
    ro.observe(element);

    return () => {
      ro.unobserve(element);
    };
  }, []);

  if (renderContainer) {
    if (aspectRatio > 1) {
      const width = clientRect.width * 0.9;
      const height = width / aspectRatio;
      imageContainerRect = {
        width: width,
        height: height,
        left: clientRect.width * 0.05,
        top: (clientRect.height - height) / 2,
      };
    } else {
      const height = clientRect.height * 0.9;
      const width = height * aspectRatio;
      imageContainerRect = {
        height: height,
        width: width,
        top: clientRect.height * 0.05,
        left: (clientRect.width - width) / 2,
      };
    }

    containerStyles = {
      position: 'absolute',
      left: `${imageContainerRect.left}px`,
      top: `${imageContainerRect.top}px`,
      width: `${imageContainerRect.width}px`,
      height: `${imageContainerRect.height}px`,
    };
  }

  if (renderImage) {
    const renderedImageRect = fitRect(
      imageRect,
      essentialRect,
      normalizeRect(imageContainerRect)
    );

    imageUrl = pathToUrl(imagePath);

    imageStyles = {
      position: 'absolute',
      left: `${renderedImageRect.left}px`,
      top: `${renderedImageRect.top}px`,
      width: `${renderedImageRect.width}px`,
      height: `${renderedImageRect.height}px`,
    };
  }

  return (
    <div className="image-essential-container" ref={imageContainerRef}>
      <div className="image-essential-image-container" style={containerStyles}>
        {renderImage && (
          <img
            className="image-essential-image"
            src={imageUrl}
            alt=""
            style={imageStyles}
          />
        )}
      </div>
    </div>
  );
};

export default ImageEssentialPreview;

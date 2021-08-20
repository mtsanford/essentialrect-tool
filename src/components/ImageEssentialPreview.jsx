import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { pathToUrl, clipRect, normalizeRect } from '../lib/util';
import { fitRect, clientToImageRect } from '../lib/fit-essential-rect';
import log from '../lib/log';

const ImageEssentialPreview = () => {
  let imageUrl, imageStyles;
  const [clientRect, setClientRect] = useState(null);
  const imageContainerRef = useRef();
  const imagePath = useSelector((state) => state.currentImage.filePath);
  const imageRect = useSelector((state) => state.currentImage.imageRect);
  const essentialRect = useSelector(
    (state) => state.currentImage.essentialRect
  );

  const renderImage =
    imageContainerRef.current &&
    imagePath &&
    imageRect.width > 0 &&
    imageRect.height > 0;

  useEffect(() => {
    const element = imageContainerRef.current;
    // const clientRect = normalizeRect(
    //   imageContainerRef.current.getBoundingClientRect()
    // );
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

  if (renderImage) {
    const clientRect = normalizeRect(
      imageContainerRef.current.getBoundingClientRect()
    );

    const renderedImageRect = fitRect(imageRect, essentialRect, clientRect);

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
    <div className="image-essential-container">
      <div className="image-essential-image-container" ref={imageContainerRef}>
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

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { pathToUrl, clipRect } from '../lib/util';
import { fitRect, clientToImageRect } from '../lib/fit-essential-rect';
import log from '../lib/log';

const ImageEssentialPreview = () => {
  const imageViewerRef = useRef();
  const imagePath = useSelector((state) => state.currentImage.filePath);
  const imageRect = useSelector((state) => state.currentImage.imageRect);
  const essentialRect = useSelector(
    (state) => state.currentImage.essentialRect
  );

  const imageUrl = pathToUrl(imagePath);

  useEffect(() => {
    const imageViewerElement = imageViewerRef.current;
    const resizeHandler = (entries) => {
      const clientRect = {
        left: 0,
        top: 0,
        width: entries[0].contentRect.width,
        height: entries[0].contentRect.height,
      };

      // positionDispatch({
      //   type: 'resize',
      //   payload: {
      //     clientRect,
      //   },
      // });
    };
    const ro = new ResizeObserver(resizeHandler);
    ro.observe(imageViewerElement);
    return () => ro.unobserve(imageViewerElement);
  }, []);

  const imageStyles = {
    width: '100px',
  };

  return (
    <div className="image-essential-container" ref={imageViewerRef}>
      <img
        className="image-essential-image"
        src={imageUrl}
        alt=""
        style={imageStyles}
      />
    </div>
  );
};

export default ImageEssentialPreview;

import React, { useRef } from 'react';
import { pathToUrl } from '../lib/util';

const ImageViewer = (props) => {
  const imageRef = useRef();
  const { imagePath } = props;
  const imageUrl = pathToUrl(imagePath);

  return (
    <div
      ref={imageRef}
      className="image-viewer"
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
  );
};

export default ImageViewer;


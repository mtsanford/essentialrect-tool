import React, { useContext } from 'react';
import { pathToUrl } from '../lib/util';


import CurrentImageContext from '../store/current-image-context';


const ImageViewer = (props) => {
  const currentImageContext = useContext(CurrentImageContext);
  const imagePath = currentImageContext.filePath;
  const imageUrl = pathToUrl(imagePath);

  return (
    <div
      className="image-viewer"
      style={{ backgroundImage: `url(${imageUrl})` }}
    />
  );
};

export default ImageViewer;


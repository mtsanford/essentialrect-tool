import React, { useState, useSelector } from 'react';

import log from '../lib/log';

const ImageEssentiaPreview = () => {
  const imagePath = useSelector((state) => state.currentImage.filePath);
  const imageRect = useSelector((state) => state.currentImage.imageRect);
  const essentialRect = useSelector(
    (state) => state.currentImage.essentialRect
  );

  return <div className="image-essential-container">

  </div>;
};

export default ImageGrid;

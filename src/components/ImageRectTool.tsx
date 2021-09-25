import React from 'react';

import ImageViewer from './ImageViewer';
import ImageViewerControls from './ImageViewerControls';
import ImageViewerInfo from './ImageViewerInfo';

const ImageRectTool = () => {
  return (
    <div className="image-rect-tool">
      <ImageViewerControls />
      <ImageViewer />
      <ImageViewerInfo />
    </div>
  );
}

export default ImageRectTool;

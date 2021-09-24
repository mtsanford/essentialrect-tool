import React from 'react';

import ImageViewer from './ImageViewer';
import ImageViewerControls from './ImageViewerControls';

const ImageRectTool = () => {
  return (
    <div className="image-rect-tool">
      <ImageViewerControls />
      <ImageViewer />
    </div>
  );
}

export default ImageRectTool;

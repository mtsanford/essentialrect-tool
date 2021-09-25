import React from 'react';
import { Rect, rectEmpty } from '../model/Rect';

import {
  selectCurrentImage,
} from '../store/current-image-slice';

import { useAppSelector } from '../store/hooks';

const ImageViewerControls: React.FC = () => {
  const { essentialRect } = useAppSelector(selectCurrentImage);
  let monitorText = '';

  if (essentialRect) {
    const l = Math.floor(essentialRect.left);
    const t = Math.floor(essentialRect.top);
    const w = Math.floor(essentialRect.width);
    const h = Math.floor(essentialRect.height);

    monitorText = `{left:${l}, top:${t}, width:${w}, height:${h}}`;
  }

  return (
    <div className="image-viewer-controls">
    </div>
  );
};

export default ImageViewerControls;

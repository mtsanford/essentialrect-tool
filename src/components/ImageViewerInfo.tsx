import React, { useCallback, MouseEventHandler } from 'react';

import { clipboard } from 'electron';
import { selectCurrentImage } from '../store/current-image-slice';
import { useAppSelector } from '../store/hooks';

const ImageViewerInfo: React.FC = () => {
  const { essentialRect } = useAppSelector(selectCurrentImage);
  let monitorText = '';

  if (essentialRect) {
    const l = Math.floor(essentialRect.left);
    const t = Math.floor(essentialRect.top);
    const w = Math.floor(essentialRect.width);
    const h = Math.floor(essentialRect.height);

    monitorText = `{left:${l}, top:${t}, width:${w}, height:${h}}`;
  }

  const monitorClickHandler: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();
      clipboard.writeText(monitorText);
    },
    [monitorText]
  );

  return (
    <div className="image-viewer-info">
      {monitorText && (
        <div
          className="image-viewer-controls-monitor"
          onClick={monitorClickHandler}
        >
          {monitorText}
        </div>
      )}
    </div>
  );
};

export default ImageViewerInfo;

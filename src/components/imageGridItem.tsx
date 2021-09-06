import React, { MouseEvent, useRef } from 'react';
import useDoubleClick from 'use-double-click';
import { ipcRenderer } from 'electron';
import { pathToUrl } from '../lib/util';
import { useAppDispatch } from '../store/hooks';

import { setCurrentImage } from '../store/current-image-actions';

const ImageGridItem: React.FC<{ imagePath: string }> = ({ imagePath }) => {
  const dispatch = useAppDispatch();
  const imageRef = useRef<HTMLDivElement>(null);
  const imageUrl = pathToUrl(imagePath);

  useDoubleClick({
    onSingleClick: () => {
      dispatch(setCurrentImage(imagePath));
    },
    onDoubleClick: () => {
      window.open(imagePath);
    },
    ref: imageRef,
  });

  const dragStartHandler = (event: MouseEvent) => {
    event.preventDefault();
    ipcRenderer.send('ondragstart', imagePath);
  };

  return (
    <div
      ref={imageRef}
      className="image-grid-item-image"
      style={{ backgroundImage: `url(${imageUrl})` }}
      draggable="true"
      onDragStart={dragStartHandler}
    />
  );
};

export default ImageGridItem;

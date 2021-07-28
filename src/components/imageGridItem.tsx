import React, { useRef } from 'react';
import useDoubleClick from 'use-double-click';
import { ipcRenderer } from 'electron';

import log from '../lib/log';

const ebs = /\\/g;

const ImageGridItem = ({ imagePath }) => {
  const imageRef = useRef();

  const imageUrl = `atom://${encodeURIComponent(imagePath).replace(
    ebs,
    '\\\\'
  )}`;

  useDoubleClick({
    onSingleClick: () => {},
    onDoubleClick: () => {
      window.open(imagePath);
    },
    ref: imageRef,
  });

  const dragStartHandler = (event) => {
    event.preventDefault()
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

import React, { useRef, useContext } from 'react';
import useDoubleClick from 'use-double-click';
import { ipcRenderer } from 'electron';
import { pathToUrl } from '../lib/util';

import log from '../lib/log';

import CurrentImageContext from '../store/current-image-context';

const ImageGridItem = (props) => {
  const imageRef = useRef();
  const { imagePath } = props;
  const imageUrl = pathToUrl(imagePath);

  const currentImageContext = useContext(CurrentImageContext);

  useDoubleClick({
    onSingleClick: () => {
      // if (props.onClick) props.onClick(imagePath);
      currentImageContext.setFilePath(imagePath);
      log(`click ${imagePath}`);
    },
    onDoubleClick: () => {
      window.open(imagePath);
    },
    ref: imageRef,
  });

  const dragStartHandler = (event) => {
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

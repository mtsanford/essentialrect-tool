import { ipcRenderer } from 'electron';
import { isAbsolute } from 'path';
import React, { useContext, useEffect, useReducer } from 'react';
// import { Fragment } from 'react';
import { useImmerReducer } from 'use-immer';
import { pathToUrl } from '../lib/util';

import CurrentImageContext from '../store/current-image-context';

const imagePositionDefault = {
  dragging: false,
  mouseDownPos: {
    x: 0,
    y: 0,
  },
  clientRect: {
    left: 0,
    right: 0,
    width: 0,
    height: 0,
  },
  imageOffset: {
    x: 0,
    y: 0,
  },
};

const imagePositionReducer = (state, action) => {
  if (action.type === 'clientSet') {
    return state;
  }
  if (action.type === 'mouseDown') {
    console.log(action.payload);
    return state;
  }
  if (action.type === 'mouseMove') {
    return state;
  }
  if (action.type === 'mouseUp') {
    return state;
  }
  return state;
};

const ImageViewer = (props) => {
  const currentImageContext = useContext(CurrentImageContext);
  const imagePath = currentImageContext.filePath;
  const imageUrl = pathToUrl(imagePath);

  const [positionState, positionDispatch] = useImmerReducer(
    imagePositionReducer,
    imagePositionDefault
  );

  useEffect(() => {
    const imageInfo = ipcRenderer.sendSync('get-image-info', imagePath);
    console.log(imageInfo);
  }, [imagePath]);

  const imageStyles = {
    position: 'absolute',
    width: '200px',
    left: '200px',
  };

  const mouseDownHandler = (event) => {
    const clientRect = event.target.getBoundingClientRect();
    const pos = { x: event.clientX, y: event.clientY };
    positionDispatch({
      type: 'mouseDown',
      payload: {
        clientRect,
        pos,
      },
    });
  };

  const mouseMoveHandler = (event) => {};

  const mouseUpHander = (event) => {};

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="image-viewer"
        onMouseDown={mouseDownHandler}
        onMouseMove={mouseMoveHandler}
        onMouseUp={mouseUpHander}
        // style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <img src={imageUrl} alt="" style={imageStyles} />
      </div>
    </>
  );
};

export default ImageViewer;

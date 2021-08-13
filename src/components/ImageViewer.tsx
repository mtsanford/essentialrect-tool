import { ipcRenderer } from 'electron';
import { isAbsolute } from 'path';
import React, { useContext, useEffect, useReducer } from 'react';
// import { Fragment } from 'react';
import { useImmerReducer } from 'use-immer';
import { current } from 'immer';
import { pathToUrl } from '../lib/util';

import CurrentImageContext from '../store/current-image-context';

const imagePositionDefault = {
  dragging: false,
  lastMousePos: {
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

// IMPORTANT: Using immer!
const imagePositionReducer = (state, action) => {
  if (action.type === 'mouseDown') {
    state.lastMousePos = action.payload.pos;
    state.dragging = true;
    return;
  }
  if (action.type === 'mouseMove') {
    if (state.dragging) {
      state.imageOffset = {
        x: state.imageOffset.x + action.payload.pos.x - state.lastMousePos.x,
        y: state.imageOffset.y + action.payload.pos.y - state.lastMousePos.y,
      };
      state.lastMousePos = action.payload.pos;
    }
    return;
  }
  if (action.type === 'mouseUp') {
    if (state.dragging) {
      state.imageOffset = {
        x: state.imageOffset.x + action.payload.pos.x - state.lastMousePos.x,
        y: state.imageOffset.y + action.payload.pos.y - state.lastMousePos.y,
      };
      state.dragging = false;
    }
    // console.log(current(state));
    return;
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
    left: `${positionState.imageOffset.x}px`,
    top: `${positionState.imageOffset.y}px`,
    pointerEvents: 'none',
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

  const mouseMoveHandler = (event) => {
    const clientRect = event.target.getBoundingClientRect();
    const pos = { x: event.clientX, y: event.clientY };
    positionDispatch({
      type: 'mouseMove',
      payload: {
        clientRect,
        pos,
      },
    });
  };

  const mouseUpHander = (event) => {
    const clientRect = event.target.getBoundingClientRect();
    const pos = { x: event.clientX, y: event.clientY };
    positionDispatch({
      type: 'mouseUp',
      payload: {
        clientRect,
        pos,
      },
    });
  };

  return (
    <div className="image-viewer">
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="image-viewer-overlay"
        onMouseDown={mouseDownHandler}
        onMouseMove={mouseMoveHandler}
        onMouseUp={mouseUpHander}
        // style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <img
        className="image-viewer-image"
        src={imageUrl}
        alt=""
        style={imageStyles}
      />
    </div>
  );
};

export default ImageViewer;

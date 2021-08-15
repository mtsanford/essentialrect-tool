import { ipcRenderer } from 'electron';
import React, { useRef, useContext, useEffect, useReducer } from 'react';
import { useImmerReducer } from 'use-immer';
import { current } from 'immer';
import { pathToUrl } from '../lib/util';

import CurrentImageContext from '../store/current-image-context';
import { Action } from 'history';

const imagePositionDefault = {
  dragging: false,
  startMousePos: {
    x: 0,
    y: 0,
  },
  lastMousePos: {
    x: 0,
    y: 0,
  },
  clientRect: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  },
  selectRect: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  },
  imageRect: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  },
  essentialImageRect: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  },
  renderedImageRect: {
    left: 0,
    top: 0,
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
  let mousePos = { x: 0, y: 0 };
  if (action.payload.clientRect && action.payload.mousePos) {
    mousePos = {
      x: action.payload.mousePos.x - action.payload.clientRect.left,
      y: action.payload.mousePos.y - action.payload.clientRect.top,
    };
  }

  function calculateRenderedImageRect() {
    // the essential rect needs to fit in client rect, so pick
    // the smallest scale
    const candidateScale1 = action.payload.clientRect.width / state.essentialImageRect.width;
    const candidateScale2 = action.payload.clientRect.height / state.essentialImageRect.height;
    const scale = Math.min(candidateScale1, candidateScale2);
  }

  if (action.type === 'init') {
    state.imageRect = action.payload.imageRect;
    state.essentialImageRect = action.payload.essentialImageRect;
    calculateRenderedImageRect();
  }

  if (action.type === 'mouseDown') {
    state.startMousePos = mousePos;
    state.dragging = true;

    state.selectRect = {
      left: mousePos.x,
      top: mousePos.y,
      width: 0,
      height: 0,
    };

    return;
  }

  if (action.type === 'mouseMove' || action.type === 'mouseUp') {
    if (state.dragging) {
      state.selectRect = {
        left: Math.min(state.startMousePos.x, mousePos.x),
        top: Math.min(state.startMousePos.y, mousePos.y),
        width: Math.abs(mousePos.x - state.startMousePos.x),
        height: Math.abs(mousePos.y - state.startMousePos.y),
      };
    }
  }

  if (action.type === 'mouseMove') {
    return;
  }

  if (action.type === 'mouseUp') {
    state.dragging = false;
    return;
  }
  return state;
};

const ImageViewer = (props) => {
  const imageViewerRef = useRef();
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

  const mouseDownHandler = (event) => {
    const clientRect = imageViewerRef.current.getBoundingClientRect();
    const mousePos = { x: event.clientX, y: event.clientY };
    positionDispatch({
      type: 'mouseDown',
      payload: {
        clientRect,
        mousePos,
      },
    });
  };

  const mouseMoveHandler = (event) => {
    const clientRect = imageViewerRef.current.getBoundingClientRect();
    const mousePos = { x: event.clientX, y: event.clientY };
    positionDispatch({
      type: 'mouseMove',
      payload: {
        clientRect,
        mousePos,
      },
    });
  };

  const mouseUpHander = (event) => {
    const clientRect = imageViewerRef.current.getBoundingClientRect();
    const mousePos = { x: event.clientX, y: event.clientY };
    positionDispatch({
      type: 'mouseUp',
      payload: {
        clientRect,
        mousePos,
      },
    });
  };

  const imageStyles = {
    position: 'absolute',
    width: '500px',
    left: `${positionState.imageOffset.x}px`,
    top: `${positionState.imageOffset.y}px`,
    pointerEvents: 'none',
  };

  const selectStyles = {
    position: 'absolute',
    left: `${positionState.selectRect.left}px`,
    top: `${positionState.selectRect.top}px`,
    width: `${positionState.selectRect.width}px`,
    height: `${positionState.selectRect.height}px`,
    visibility: positionState.dragging ? 'visible' : 'hidden',
    pointerEvents: 'none',
  };

  return (
    <div className="image-viewer" ref={imageViewerRef}>
      <div className="image-viewer-select" style={selectStyles} />
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        className="image-viewer-overlay"
        onMouseDown={mouseDownHandler}
        onMouseMove={mouseMoveHandler}
        onMouseUp={mouseUpHander}
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

import React, { useRef, useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import { useSelector, useDispatch } from 'react-redux';

import { pathToUrl, clipRect } from '../lib/util';
import {
  fitRect,
  clientToImageRect,
  imageToClientRect,
} from '../lib/fit-essential-rect';
import { currentImageActions } from '../store/current-image-slice';
import useClientRect from '../hooks/use-client-rect';

const selectDefault = {
  dragging: false,
  startMousePos: {
    x: 0,
    y: 0,
  },
  selectRect: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  },
  essentialRect: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  },
};

// IMPORTANT: Using immer!
const selectReducer = (state, action) => {
  if (action.type === 'init') {
    const { imageRect } = action.payload;
    state.imageRect = imageRect;
    state.essentialRect = imageRect; // initially show whole image
    return;
  }

  if (action.type === 'mouseDown') {
    const { mousePos } = action.payload;
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
    const { mousePos } = action.payload;
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
    const { imageRect, renderedImageRect } = action.payload;
    const essentialRect = clientToImageRect(
      imageRect,
      renderedImageRect,
      state.selectRect
    );
    const clipped = clipRect(essentialRect, imageRect);
    if (clipped.width > 0 && clipped.height > 0) {
      state.essentialRect = clipped;
    }
    state.dragging = false;
    return;
  }
};

const getMousePos = (event) => ({
  x: event.nativeEvent.offsetX,
  y: event.nativeEvent.offsetY,
});

const ImageViewer = (props) => {
  let imageStyles;
  let essentialRectStyles;
  let renderedImageRect;
  let essentialRectClient;
  let selectStyles;

  const dispatch = useDispatch();
  const [imageViewerRef, clientRect] = useClientRect();
  const {
    filePath: imagePath,
    isValid: imageIsValid,
    imageRect,
    essentialRect,
  } = useSelector((state) => state.currentImage);
  const imageUrl = pathToUrl(imagePath);

  const [selectState, selectDispatch] = useImmerReducer(
    selectReducer,
    selectDefault
  );

  const drawImage = imageIsValid && clientRect;

  useEffect(() => {
    if (!drawImage) {
      return;
    }

    selectDispatch({
      type: 'init',
      payload: {
        clientRect,
        imageRect,
      },
    });
  }, [drawImage, clientRect, imageIsValid, imageRect, selectDispatch]);

  useEffect(() => {
    dispatch(currentImageActions.setEssentialRect(selectState.essentialRect));
  }, [selectState.essentialRect, dispatch]);

  if (drawImage) {
    renderedImageRect = fitRect(imageRect, imageRect, clientRect);
    imageStyles = {
      left: `${renderedImageRect.left}px`,
      top: `${renderedImageRect.top}px`,
      width: `${renderedImageRect.width}px`,
      height: `${renderedImageRect.height}px`,
    };

    essentialRectClient = imageToClientRect(
      imageRect,
      renderedImageRect,
      essentialRect
    );
    essentialRectStyles = {
      left: `${essentialRectClient.left}px`,
      top: `${essentialRectClient.top}px`,
      width: `${essentialRectClient.width}px`,
      height: `${essentialRectClient.height}px`,
    };

    selectStyles = {
      left: `${selectState.selectRect.left}px`,
      top: `${selectState.selectRect.top}px`,
      width: `${selectState.selectRect.width}px`,
      height: `${selectState.selectRect.height}px`,
      visibility: selectState.dragging ? 'visible' : 'hidden',
    };
  }

  const mouseHandler = (type, event) => {
    // console.log(type);
    // console.log(event);

    if (!drawImage) {
      return;
    }

    selectDispatch({
      type,
      payload: {
        clientRect,
        imageRect,
        renderedImageRect,
        mousePos: getMousePos(event),
      },
    });
  };

  return (
    <div className="image-viewer" ref={imageViewerRef}>
      {drawImage && (
        <>
          <div className="image-viewer-select" style={selectStyles} />
          <div
            className="image-viewer-essential-rect"
            style={essentialRectStyles}
          />
          <div
            className="image-viewer-overlay"
            role="presentation"
            onMouseDown={mouseHandler.bind(this, 'mouseDown')}
            onMouseMove={mouseHandler.bind(this, 'mouseMove')}
            onMouseUp={mouseHandler.bind(this, 'mouseUp')}
          />
          <img
            className="image-viewer-image"
            src={imageUrl}
            alt=""
            style={imageStyles}
          />
        </>
      )}
    </div>
  );
};

export default ImageViewer;

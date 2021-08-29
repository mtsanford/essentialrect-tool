import React, { MouseEvent, MouseEventHandler, useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import { useSelector, useDispatch } from 'react-redux';

import { pathToUrl, clipRect } from '../lib/util';
import { Rect, Point } from '../model/Rect';
import {
  fitRect,
  clientToImageRect,
  imageToClientRect,
} from '../lib/fit-essential-rect';
import { currentImageActions } from '../store/current-image-slice';
import useClientRect from '../hooks/use-client-rect';

type SelectState = {
  dragging: boolean;
  startMousePos: { x: number; y: number };
  selectRect: Rect;
  calculatedEssentialRect: Rect;
};

type SelectAction =
  | { type: 'mouseDown'; payload: { mousePos: Point } }
  | { type: 'mouseMove'; payload: { mousePos: Point } }
  | {
      type: 'mouseUp';
      payload: { mousePos: Point, imageRect: Rect; renderedImageRect: Rect };
    };

const selectDefault: SelectState = {
  dragging: false,
  startMousePos: { x: 0, y: 0 },
  selectRect: { left: 0, top: 0, width: 0, height: 0 },
  calculatedEssentialRect: { left: 0, top: 0, width: 0, height: 0 },
};

// IMPORTANT: Using immer!
const selectReducer = (state: SelectState, action: SelectAction) => {
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

  if (action.type === 'mouseUp') {
    const { imageRect, renderedImageRect } = action.payload;
    const essentialRect = clientToImageRect(
      imageRect,
      renderedImageRect,
      state.selectRect
    );
    const clipped = clipRect(essentialRect, imageRect);
    if (clipped.width > 0 && clipped.height > 0) {
      state.calculatedEssentialRect = clipped;
    }
    state.dragging = false;
  }
};

const stylesFromRect = (rect: Rect) => ({
  left: `${rect.left}px`,
  top: `${rect.top}px`,
  width: `${rect.width}px`,
  height: `${rect.height}px`,
});

const ImageViewer: React.FC = () => {
  let imageStyles;
  let essentialRectStyles;
  let renderedImageRect: Rect;
  let essentialRectClient: Rect;
  let selectStyles;

  const dispatch = useDispatch();
  const [imageViewerRef, clientRect] = useClientRect();
  const { filePath, isValid, imageRect, essentialRect } = useSelector(
    (state) => state.currentImage
  );
  const imageUrl = pathToUrl(filePath);

  const [
    { calculatedEssentialRect, selectRect, dragging },
    selectDispatch,
  ] = useImmerReducer(selectReducer, selectDefault);

  useEffect(() => {
    if (calculatedEssentialRect) {
      dispatch(currentImageActions.setEssentialRect(calculatedEssentialRect));
    }
  }, [calculatedEssentialRect, dispatch]);

  // do we have a valid image and rect to draw it in?
  const ready = isValid && clientRect;

  if (ready) {
    renderedImageRect = fitRect(imageRect, imageRect, clientRect);
    imageStyles = stylesFromRect(renderedImageRect);
    essentialRectClient = imageToClientRect(
      imageRect,
      renderedImageRect,
      essentialRect
    );

    essentialRectStyles = stylesFromRect(essentialRectClient);

    if (dragging) selectStyles = stylesFromRect(selectRect);
  }

  const mouseDownHandler: MouseEventHandler<HTMLDivElement> = (
    event: MouseEvent
  ) => {
    selectDispatch({
      type: 'mouseDown',
      payload: {
        mousePos: {
          x: event.nativeEvent.offsetX,
          y: event.nativeEvent.offsetY,
        },
      },
    });
  };

  const mouseMoveHandler: MouseEventHandler<HTMLDivElement> = (
    event: MouseEvent
  ) => {
    selectDispatch({
      type: 'mouseMove',
      payload: {
        mousePos: {
          x: event.nativeEvent.offsetX,
          y: event.nativeEvent.offsetY,
        },
      },
    });
  };

  const mouseUpHandler: MouseEventHandler<HTMLDivElement> = (
    event: MouseEvent
  ) => {
    selectDispatch({
      type: 'mouseUp',
      payload: {
        imageRect,
        renderedImageRect,
        mousePos: {
          x: event.nativeEvent.offsetX,
          y: event.nativeEvent.offsetY,
        },
      },
    });
  };

  return (
    <div className="image-viewer" ref={imageViewerRef}>
      {ready && (
        <>
          {dragging && (
            <div className="image-viewer-select" style={selectStyles} />
          )}
          <div
            className="image-viewer-essential-rect"
            style={essentialRectStyles}
          />
          <div
            className="image-viewer-overlay"
            role="presentation"
            onMouseDown={mouseDownHandler}
            onMouseMove={mouseMoveHandler}
            onMouseUp={mouseUpHandler}
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

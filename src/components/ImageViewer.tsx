import React, { MouseEvent, MouseEventHandler, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { pathToUrl } from '../lib/util';
import {
  Rect,
  Point,
  rectFromPoints,
  rectEmpty,
  rectClip,
  emptyRect,
  emptyPoint,
} from '../model/Rect';
import {
  fitRect,
  clientToImageRect,
  imageToClientRect,
} from '../lib/fit-essential-rect';
import { currentImageActions } from '../store/current-image-slice';
import useClientRect from '../hooks/use-client-rect';

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
  const [dragging, setDragging] = useState<boolean>(false);
  const [startMousePos, setStartMousePos] = useState<Point>(emptyPoint);
  const [selectRect, setSelectRect] = useState<Rect>(emptyRect);
  const [imageViewerRef, clientRect] = useClientRect();
  const { filePath, isValid, imageRect, essentialRect } = useSelector(
    (state) => state.currentImage
  );

  const imageUrl = pathToUrl(filePath);

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
    const mousePos = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
    const newSelectRect = rectFromPoints(mousePos, mousePos);

    setDragging(true);
    setStartMousePos(mousePos);
    setSelectRect(newSelectRect);
  };

  const mouseMoveHandler: MouseEventHandler<HTMLDivElement> = (
    event: MouseEvent
  ) => {
    if (!dragging) {
      return;
    }

    const mousePos = {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
    const newSelectRect = rectFromPoints(startMousePos, mousePos);

    setDragging(true);
    setSelectRect(newSelectRect);
  };

  const mouseUpHandler: MouseEventHandler<HTMLDivElement> = () => {
    const newEssentialRect = clientToImageRect(
      imageRect,
      renderedImageRect,
      selectRect
    );
    const clipped = rectClip(newEssentialRect, imageRect);

    setDragging(false);
    if (!rectEmpty(clipped)) {
      dispatch(currentImageActions.setEssentialRect(newEssentialRect));
    }
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

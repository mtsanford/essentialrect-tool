import React, {
  MouseEvent,
  MouseEventHandler,
  useState,
  CSSProperties,
} from 'react';

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
import {
  currentImageActions,
  selectCurrentImage,
} from '../store/current-image-slice';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import useClientRect from '../hooks/use-client-rect';

const stylesFromRect = (rect: Rect): CSSProperties => ({
  left: `${rect.left}px`,
  top: `${rect.top}px`,
  width: `${rect.width}px`,
  height: `${rect.height}px`,
});

const ImageViewer: React.FC = () => {
  let imageStyles: CSSProperties = {};
  let essentialRectStyles: CSSProperties = {};
  let renderedImageRect: Rect;
  let essentialRectClient: Rect;
  let selectStyles;

  const dispatch = useAppDispatch();
  const [dragging, setDragging] = useState<boolean>(false);
  const [startMousePos, setStartMousePos] = useState<Point>(emptyPoint);
  const [selectRect, setSelectRect] = useState<Rect>(emptyRect);
  const [imageViewerRef, clientRect] = useClientRect();
  const { filePath, isValid, imageRect, essentialRect } = useAppSelector(
    selectCurrentImage
  );

  const imageUrl = pathToUrl(filePath);

  // do we have a valid image and rect to draw it in?
  const ready = isValid && !rectEmpty(clientRect);

  if (ready && clientRect && imageRect && essentialRect) {
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
    if (!imageRect) return;

    const newEssentialRect = clientToImageRect(
      imageRect,
      renderedImageRect,
      selectRect
    );
    const clipped = rectClip(newEssentialRect, imageRect);

    setDragging(false);
    if (!rectEmpty(clipped)) {
      dispatch(currentImageActions.setEssentialRect(clipped));
    }
  };

  let monitorText;

  if (essentialRect) {
    const er = {
      left: Math.floor(essentialRect.left),
      top: Math.floor(essentialRect.top),
      width: Math.floor(essentialRect.width),
      height: Math.floor(essentialRect.height),
    };
    monitorText = JSON.stringify(er);
  }

  return (
    <div className="image-viewer" ref={imageViewerRef}>
      {ready && (
        <>
          {essentialRect && (
            <div className="image-viewer-essential-rect-monitor">
              {monitorText}
            </div>
          )}
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

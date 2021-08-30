export interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export function rectClip(sourceRect: Rect, clippingRect: Rect): Rect {
  const left = Math.max(sourceRect.left, clippingRect.left);
  const top = Math.max(sourceRect.top, clippingRect.top);
  const right = Math.min(
    sourceRect.left + sourceRect.width,
    clippingRect.left + clippingRect.width
  );
  const bottom = Math.min(
    sourceRect.top + sourceRect.height,
    clippingRect.top + clippingRect.height
  );
  return {
    left,
    top,
    width: Math.max(right - left, 0),
    height: Math.max(bottom - top, 0),
  };
}

export function rectEmpty(sourceRect: Rect): boolean {
  return sourceRect.width === 0 || sourceRect.height === 0;
}

export function rectNormalize(sourceRect: Rect): Rect {
  return {
    left: Math.min(sourceRect.left, sourceRect.left + sourceRect.width),
    top: Math.min(sourceRect.top, sourceRect.top + sourceRect.height),
    width: Math.abs(sourceRect.width),
    height: Math.abs(sourceRect.height),
  };
}

export function rectFromPoints(point1: Point, point2: Point) {
  return {
    left: Math.min(point1.x, point2.x),
    top: Math.min(point1.y, point2.y),
    width: Math.abs(point1.x - point2.x),
    height: Math.abs(point1.y - point2.y),
  };
}

export const emptyPoint: Point = {
  x: 0,
  y: 0,
};

export const emptyRect: Rect = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
};

export default Rect;

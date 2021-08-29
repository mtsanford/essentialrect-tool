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

export default Rect;

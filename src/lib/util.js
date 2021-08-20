export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i = i - 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const ebs = /\\/g;

export function pathToUrl(path) {
  return `atom://${encodeURIComponent(path).replace(ebs, '\\\\')}`;
}

export function clipRect(rectToBeClipped, clippingRect) {
  const left = Math.max(rectToBeClipped.left, clippingRect.left);
  const top = Math.max(rectToBeClipped.top, clippingRect.top);
  const right = Math.min(
    rectToBeClipped.left + rectToBeClipped.width,
    clippingRect.left + clippingRect.width
  );
  const bottom = Math.min(
    rectToBeClipped.top + rectToBeClipped.height,
    clippingRect.top + clippingRect.height
  );
  return {
    left: left,
    top: top,
    width: right - left,
    height: bottom - top,
  };
}

export function normalizeRect(rect) {
  return {
    left: rect.left - rect.width,
    top: rect.top - rect.height,
    width: rect.width,
    height: rect.height,
  }
}

export default () => {};

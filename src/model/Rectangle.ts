class Rectangle {
  left: number;

  top: number;

  width: number;

  height: number;

  constructor(value: {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
  }) {
    this.left = value.left || 0;
    this.top = value.top || 0;
    this.width = value.width || 0;
    this.height = value.height || 0;
  }

  // Clip this rectangle by another rectangle, and return the
  // result as a new rectangle
  clipRect(clippingRect: Rectangle): Rectangle {
    const left = Math.max(this.left, clippingRect.left);
    const top = Math.max(this.top, clippingRect.top);
    const right = Math.min(
      this.left + this.width,
      clippingRect.left + clippingRect.width
    );
    const bottom = Math.min(
      this.top + this.height,
      clippingRect.top + clippingRect.height
    );
    return new Rectangle({
      left,
      top,
      width: Math.max(right - left, 0),
      height: Math.max(bottom - top, 0),
    });
  }

  empty(): boolean {
    return this.width === 0 || this.height === 0;
  }

  // If the rectangle has negative width or height, move it's left/top origin, and
  // normalize(): Rectangle {
  //   return new Rectangle {
  //     left:
  //   }
  // }
}

export default Rectangle;

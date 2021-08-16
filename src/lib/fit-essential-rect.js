// image = | a |  e  |          b          |
// view  = |   v    |

// a = length of portion of line left of essential (e)
// b = length of portion of line right of essential (e)
// e = length of essential part of line that must fit in view
// v = length of viewport

// i2 = | a |  e  | a |   (surrounded by lesser of a or b)

export function fitLine(a, e, b, v) {
  const i = a + e + b; // size of entire image line
  const i2 = a > b ? e + 2 * b : e + 2 * a; // essential surrounded by 2X the shorter of a or b

  if (v >= i) {
    return (v - i) / 2;
  }

  if (v > i2) {
    return a > b ? v - i : 0;
  }

  return (v - e) / 2 - a;
}

// Given a rect (clientRect) in client coordinates, get the coordinates in imageRect,
// reversing the scaling and translation done by fitRect
export function clientToImageRect(imageRect, fittedRect, clientRect) {
  const scale = imageRect.width / fittedRect.width;
  return {
    left: (clientRect.left - fittedRect.left) * scale,
    top: (clientRect.top - fittedRect.top) * scale,
    width: clientRect.width * scale,
    height: clientRect.height * scale,
  };
}

// Assume imageRect and clientRect are (left=0, top=0)
// Return: fittedRect, which scales and translate the image, such that when
// shown in clientRect, optimally shows the essentialRect of the image.
export function fitRect(imageRect, essentialRect, clientRect) {
  // How much do we have to scale image to fit essential part in client?
  // We need to pick the smaller of these two
  const hscale = clientRect.width / essentialRect.width;
  const vscale = clientRect.height / essentialRect.height;
  const scale = Math.min(hscale, vscale);

  const scaledImageRect = {
    left: 0,
    top: 0,
    width: imageRect.width * scale,
    height: imageRect.height * scale,
  };

  const scaledEssentialRect = {
    left: 0,
    top: 0,
    width: essentialRect.width * scale,
    height: essentialRect.height * scale,
  };

  const fittedRect = {
    width: imageRect.width * scale,
    height: imageRect.height * scale,
  };

  if (vscale > hscale) {
    // essentalRect width snuggly fits in client width
    fittedRect.left = -scaledEssentialRect.left;
    fittedRect.top = fitLine(
      scaledEssentialRect.top,
      scaledEssentialRect.height,
      scaledImageRect.height -
        (scaledEssentialRect.top + scaledEssentialRect.height),
      clientRect.height
    );
  } else {
    // essentalRect height snuggly fits in client height
    fittedRect.top = -scaledEssentialRect.top;
    fittedRect.left = fitLine(
      scaledEssentialRect.left,
      scaledEssentialRect.width,
      scaledImageRect.width -
        (scaledEssentialRect.left + scaledEssentialRect.width),
      clientRect.width
    );
  }

  // @#%&! Jest thinks -0 and 0 are different numbers
  const adjustedFittedRect = {
    top: fittedRect.top + 0,
    left: fittedRect.left + 0,
    width: fittedRect.width + 0,
    height: fittedRect.height + 0,
  };

  return adjustedFittedRect;
}

export default { fitLine, fitRect, clientToImageRect };

// image = | a |  e  |          b          |
// view  = |   v    |

// a = length of portion of line left of essential (e)
// b = length of portion of line right of essential (e)
// e = length of essential part of line that must fit in view
// v = length of viewport

// i2 = | a |  e  | a |   (surrounded by lesser of a or b)

export function fitLines(a, e, b, v) {
  const i = a + e + b; // size of entire image line
  const i2 = a > b ? e + 2 * b : e + 2 * a; // essential surrounded by 2X the shorter of a or b

  if (v >= i) {
    return (v - i) / 2;
  }

  if (v > i2) {
    return a > b ? i2 - i : 0;
  }

  return (v - i2) / 2;
}

export function fitRects() {}

export default fitRects;

import fitRects, { fitLines } from '../lib/fit-essential-rect';

describe('Fit lines', () => {
  it('View bigger than image test 1', () => {
    expect(fitLines(2, 1, 1, 5)).toBe(0.5);
  });
  it('View bigger than image test 2', () => {
    expect(fitLines(1, 1, 1, 5)).toBe(1);
  });
  it('View bigger than image test 3', () => {
    expect(fitLines(1, 1, 2, 5)).toBe(0.5);
  });

  it('View the same as image test 1', () => {
    expect(fitLines(1, 1, 2, 4)).toBe(0);
  });
  it('View the same as image test 2', () => {
    expect(fitLines(2, 1, 1, 4)).toBe(0);
  });

  it('left side only needs trimming test 1', () => {
    expect(fitLines(7, 1, 2, 5)).toBe(-5);
  });
  it('left side only needs trimming test 2', () => {
    expect(fitLines(7, 1, 0, 5)).toBe(-3);
  });

  it('right side only needs trimming test 1', () => {
    expect(fitLines(2, 1, 7, 5)).toBe(0);
  });
  it('right side only needs trimming test 2', () => {
    expect(fitLines(0, 1, 7, 5)).toBe(0);
  });

  it('both need trimming test 1', () => {
    expect(fitLines(1, 2, 8, 3)).toBe(-0.5);
  });
  it('both need trimming test 2', () => {
    expect(fitLines(8, 2, 1, 3)).toBe(-7.5);
  });
  it('both need trimming test 3', () => {
    expect(fitLines(8, 2, 8, 3)).toBe(-7.5);
  });
});

const clientWide = {
  left: 0,
  top: 0,
  width: 200,
  height: 100,
};

const clientTall = {
  left: 0,
  top: 0,
  width: 100,
  height: 200,
};

const smallSquareImage = {
  left: 0,
  top: 0,
  width: 50,
  height: 50,
};

describe('Fit rects', () => {
  it('all same rects should return client rect 1', () => {
    expect(fitRects(smallSquareImage, smallSquareImage, clientWide)).toEqual({
      left: 50,
      top: 0,
      width: 100,
      height: 100,
    });
  });
  it('all same rects should return client rect 2', () => {
    expect(fitRects(smallSquareImage, smallSquareImage, clientTall)).toEqual({
      left: 0,
      top: 50,
      width: 100,
      height: 100,
    });
  });
});

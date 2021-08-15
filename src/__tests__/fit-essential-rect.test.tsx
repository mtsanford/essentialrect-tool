import { fitLines } from '../lib/fit-essential-rect';

describe('Fit lines', () => {
  it('should do best fit 1', () => {
    expect(fitLines(1, 1, 1, 2)).toBe(-0.5);
  });
  it('should do best fit 2', () => {
    expect(fitLines(1, 1, 0, 2)).toBe(0);
  });
  it('should do best fit 3', () => {
    expect(fitLines(1, 1, 2, 5)).toBe(0.5);
  });
  it('should do best fit 4', () => {
    expect(fitLines(1, 1, 2, 3)).toBe(0);
  });
  it('should do best fit 5', () => {
    expect(fitLines(2, 1, 1, 3)).toBe(-1);
  });
});


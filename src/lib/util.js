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

export default () => {};

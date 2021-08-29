import fs from 'fs';
import path from 'path';

import React, { useEffect } from 'react';
import useListReducer from '../hooks/use-list-reducer';

import ImageGrid from './ImageGrid';

const imagePathsFromDir = (folder: string, paths: string[]) => {
  const imageFileExtensions = ['.jpg', '.jpeg', '.webp', '.gif', '.png'];
  return paths
    .filter((fileName) =>
      imageFileExtensions.includes(path.extname(fileName).toLowerCase())
    )
    .map((fileName: string) => path.join(folder, fileName).toString());
};

const RandomImages: React.FC<{ picFolder: string }> = ({ picFolder }) => {
  const [
    { fullList: imageFiles, currentBunch: imageBunch },
    dispatchList,
  ] = useListReducer(16);

  useEffect(() => {
    const keydownListener = ({ key }) => {
      if (key === 'e') {
        dispatchList({ type: 'nextbunch' });
      }
      if (key === 'q') {
        dispatchList({ type: 'previousbunch' });
      }
    };

    window.addEventListener('keydown', keydownListener);

    return () => window.removeEventListener('keydown', keydownListener);
  }, [dispatchList]);

  useEffect(() => {
    let canceled = false;

    fs.readdir(picFolder, (err, files) => {
      if (canceled) return;

      if (err) {
        dispatchList({
          type: 'setlist',
          list: [],
        });
        return;
      }

      dispatchList({
        type: 'setlist',
        list: imagePathsFromDir(picFolder, files),
      });
    });

    return () => {
      canceled = true;
    };
  }, [picFolder, dispatchList]);

  if (!imageBunch || imageBunch.length === 0 || imageFiles.length === 0) {
    return <div className="randomimages-no-images">No images found</div>;
  }

  return <ImageGrid images={imageBunch} />;
};

export default RandomImages;

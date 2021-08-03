import React from 'react';

import log from '../lib/log';

import ImageGridItem from './imageGridItem';


const ImageGrid = ({ images, onSelectImage }) => {

  const onClickHandler = (filePath) => {
    if (onSelectImage) onSelectImage(filePath);
    log('clickhandler', filePath);
  };

  return (
    <div className="imagegrid-container">
      {images.map((path, i) => (
        <div className={`imagegrid-item imagegrid-item-${i + 1}`} key={i}>
          <ImageGridItem imagePath={path} onClick={onClickHandler} />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;

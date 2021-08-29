import React from 'react';

import ImageGridItem from './imageGridItem';

const ImageGrid: React.FC<{ images: string[] }> = ({ images }) => {
  return (
    <div className="imagegrid-container">
      {images.map((path, i) => (
        <div className={`imagegrid-item imagegrid-item-${i + 1}`} key={path}>
          <ImageGridItem imagePath={path} />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;

import React from 'react';

import ImageEssentialPreview from './ImageEssentialPreview';

const ImageEssentialGrid = (props) => {
  const aspectRatios = [
    {
      aspectRatio: 16 / 9,
      id: 1,
    },
    {
      aspectRatio: 9 / 16,
      id: 2,
    },
    {
      aspectRatio: 4 / 3,
      id: 3,
    },
  ];

  return (
    <div className="image-essential-grid">
      {aspectRatios.map((aspectRatioInfo) => (
        <ImageEssentialPreview
          aspectRatioInfo={aspectRatioInfo}
          key={aspectRatioInfo.id}
        />
      ))}
    </div>
  );
};

export default ImageEssentialGrid;

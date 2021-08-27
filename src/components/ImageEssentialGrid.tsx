import React from 'react';

import ImageEssentialPreview from './ImageEssentialPreview';

const ImageEssentialGrid = (props) => {
  const aspectRatios = [
    {
      name: "HTDV - iPhone 8 - MacBook (16:9)",
      aspectRatio: 16 / 9,
      id: 1,
    },
    {
      name: "HTDV - iPhone 8 (9:16)",
      aspectRatio: 9 / 16,
      id: 2,
    },
    {
      name: "Square",
      aspectRatio: 1,
      id: 3,
    },
    {
      name: "iPad (4:3)",
      aspectRatio: 4 / 3,
      id: 4,
    },
    {
      name: "iPhone 11/12 (19.5:9)",
      aspectRatio: 19.5 / 9,
      id: 5,
    },
    {
      name: "iPhone 11/12 (9:19.5)",
      aspectRatio: 9 / 19.5,
      id: 6,
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

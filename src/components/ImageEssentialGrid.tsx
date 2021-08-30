import React from 'react';

import AspectRatio from '../model/AspectRatio';

import ImageEssentialPreview from './ImageEssentialPreview';

const aspectRatios: AspectRatio[] = [
  {
    name: 'HD - iPhone 6/7/8',
    ratioText: '(16:9)',
    aspectRatio: 16 / 9,
    id: '16:9',
  },
  {
    name: 'HD - iPhone 6/7/8',
    ratioText: '(9:16)',
    aspectRatio: 9 / 16,
    id: '(9:16)',
  },
  {
    name: 'Square',
    ratioText: '(1:1)',
    aspectRatio: 1,
    id: '(1:1)',
  },
  {
    name: 'iPad',
    ratioText: '(4:3)',
    aspectRatio: 4 / 3,
    id: '(4:3)',
  },
  {
    name: 'iPhone 11/12',
    ratioText: '(19.5:9)',
    aspectRatio: 19.5 / 9,
    id: '(19.5:9)',
  },
  {
    name: 'iPhone 11/12',
    ratioText: '(9:19.5)',
    aspectRatio: 9 / 19.5,
    id: '(9:19.5)',
  },
];

const ImageEssentialGrid: React.FC = () => {
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

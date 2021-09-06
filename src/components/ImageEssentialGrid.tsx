import React from 'react';

import { useAppSelector } from '../store/hooks';
import { selectAspectRatios } from '../store/config-slice';
import { selectPreviewColumns } from '../store/ui-slice';

import ImageEssentialPreview from './ImageEssentialPreview';

const ImageEssentialGrid: React.FC = () => {
  const aspectRatios = useAppSelector(selectAspectRatios);
  const previewColumns = useAppSelector(selectPreviewColumns);

  const classes =
    previewColumns > 1
      ? 'image-essential-grid image-essential-grid-two-column'
      : 'image-essential-grid';

  return (
    <div className={classes}>
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

import React from 'react';

import { useAppSelector } from '../store/hooks';
import { selectAspectRatios } from '../store/config-slice';
import { selectPreviewColumns } from '../store/ui-slice';

import { pathToUrl } from '../lib/util';

import ImageEssentialPreview from './ImageEssentialPreview';
import { selectCurrentImage } from '../store/current-image-slice';

const ImageEssentialGrid: React.FC = () => {
  const aspectRatios = useAppSelector(selectAspectRatios);
  const previewColumns = useAppSelector(selectPreviewColumns);
  const { filePath, essentialRect, imageRect } = useAppSelector(
    selectCurrentImage
  );

  const imageUrl = filePath ? pathToUrl(filePath) : undefined;

  const classes =
    previewColumns > 1
      ? 'image-essential-grid image-essential-grid-two-column'
      : 'image-essential-grid';

  return (
    <div className={classes}>
      {aspectRatios.map((aspectRatioInfo) => (
        <ImageEssentialPreview
          imageUrl={imageUrl}
          essentialRect={essentialRect}
          imageRect={imageRect}
          aspectRatioInfo={aspectRatioInfo}
          key={aspectRatioInfo.id}
        />
      ))}
    </div>
  );
};

export default ImageEssentialGrid;

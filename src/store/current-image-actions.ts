import { currentImageActions } from './current-image-slice';
import type { AppDispatch } from './index';

// need an async action to set image, because we've got no way to get
// the image size until it's loaded into an <img> DOM element.
// NativeImage from Electron appears to give the wrong values.

// TODO: need handle cancel case

export const setCurrentImage = (filePath: string) => {
  return async (dispatch: AppDispatch) => {
    const probeImage = new Image();
    probeImage.onload = () => {
      const imageRect = {
        left: 0,
        top: 0,
        width: probeImage.width,
        height: probeImage.height,
      };
      dispatch(
        currentImageActions.setImage({
          filePath,
          imageRect,
        })
      );
    };
    probeImage.src = filePath;
  };
};

export default setCurrentImage;

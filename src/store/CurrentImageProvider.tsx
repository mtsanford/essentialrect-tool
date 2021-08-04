import React, { useState } from 'react';

import CurrentImageContext from './current-image-context';

const defaultState = 'D:/Media/China2015/20150210_014858.jpg';

const CurrentImageProvider = (props) => {
  const [currentImagePath, setCurrentImagePath] = useState(defaultState);

  const setFilePath = (path) => {
    setCurrentImagePath(path);
  };

  return (
    <CurrentImageContext.Provider
      value={{
        filePath: currentImagePath,
        setFilePath: setFilePath,
      }}
    >
      {props.children}
    </CurrentImageContext.Provider>
  );
};

export default CurrentImageProvider;

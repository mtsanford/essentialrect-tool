import React from 'react';

const CurrentImageContext = React.createContext({
  filePath: null,
  setFilePath: (path) => {}
});

export default CurrentImageContext;

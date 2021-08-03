import React from 'react';

const CurrentImageContext = React.createContext({
  path: [],
  setFilePath: (path) => {},
});

export default CurrentImageContext;

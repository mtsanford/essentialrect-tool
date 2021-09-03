import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import uiActions from '../store/ui-slice';


const Single = () => {
  return (
    <div className="button single">
      <div className="square"></div>
    </div>
  )
};

const Grid = () => {
  return (
    <div className="button grid">
      <div className="square"></div>
      <div className="square"></div>
      <div className="square"></div>
      <div className="square"></div>
    </div>
  )
};

const Controls: React.FC = () => {
  const clickHandler = (event) => {};

  return (
    <div className="controls">
      <Grid />
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div className="aspect=ratio" onClick={clickHandler}>
        HD (16:9)
      </div>
    </div>
  );
};

export default Controls;

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import HappyButton from './UI/HappyButton';

import { uiActions } from '../store/ui-slice';

const Single = () => {
  return (
    <div className="button single">
      <div className="square"></div>
    </div>
  );
};

const Grid = () => {
  return (
    <div className="button grid">
      <div className="square"></div>
      <div className="square"></div>
      <div className="square"></div>
      <div className="square"></div>
    </div>
  );
};

const Controls: React.FC = () => {
  const dispatch = useDispatch();
  const previewColumns = useSelector((state) => state.ui.previewColumns);
  // const [gridView, setGridView] = useState(false);
  const clickHandler = (event) => {};

  const buttonClickHandler = (id: string) => {
    console.log(id);
    const newColumns = id === 'double' ? 2 : 1;
    console.log(uiActions);
    dispatch(uiActions.setPreviewColumns(newColumns));
  };

  const gridView = previewColumns > 1;
  console.log(`gridview = ${gridView}`);

  return (
    <div className="controls">
      <div className="controls-grid-buttons">
        <HappyButton
          token="single"
          onClick={buttonClickHandler}
          depressed={!gridView}
        >
          <Single />
        </HappyButton>
        <HappyButton
          token="double"
          onClick={buttonClickHandler}
          depressed={gridView}
        >
          <Grid />
        </HappyButton>
      </div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div className="aspect=ratio" onClick={clickHandler}>
        HD (16:9)
      </div>
    </div>
  );
};

export default Controls;

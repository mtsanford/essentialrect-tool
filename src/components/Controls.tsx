import React from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectPreviewColumns, uiActions } from '../store/ui-slice';

import HappyButton from './UI/HappyButton';

import folderIcon from '../../assets/icons/folder.svg';

const Single = () => {
  return (
    <div className="button single">
      <div className="square" />
    </div>
  );
};

const Grid = () => {
  return (
    <div className="button grid">
      <div className="square" />
      <div className="square" />
      <div className="square" />
      <div className="square" />
    </div>
  );
};

const Controls: React.FC<{ onFileOpen: () => void }> = ({ onFileOpen }) => {
  const dispatch = useAppDispatch();
  const previewColumns = useAppSelector(selectPreviewColumns);
  const clickHandler = () => {};

  const buttonClickHandler = (id: string) => {
    const newColumns = id === 'double' ? 2 : 1;
    dispatch(uiActions.setPreviewColumns(newColumns));
  };

  const openFileHandler = (id: string) => {
    onFileOpen();
  };

  const gridView = previewColumns > 1;

  return (
    <div className="controls">
      <div className="controls-grid-buttons">
        <HappyButton token="folder" onClick={openFileHandler} depressed={false}>
          <img src={folderIcon} alt="" className="button-image" />
        </HappyButton>
        <HappyButton
          token="single"
          onClick={buttonClickHandler}
          isSlave
          depressed={!gridView}
        >
          <Single />
        </HappyButton>
        <HappyButton
          token="double"
          onClick={buttonClickHandler}
          isSlave
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

import React, { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectPreviewColumns, uiActions } from '../store/ui-slice';

import HappyButton, { HappyButtonGroup } from './UI/HappyButton';

import folderIcon from '../../assets/icons/folder.svg';
import settingsIcon from '../../assets/icons/settings.svg';
import infoIcon from '../../assets/icons/info.svg';

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

const Controls: React.FC<{ onAction: (action: string) => void }> = ({
  onAction,
}) => {
  const dispatch = useAppDispatch();
  const previewColumns = useAppSelector(selectPreviewColumns);

  const buttonDescriptors = [
    {
      token: 'single',
      content: <Single />,
    },
    {
      token: 'double',
      content: <Grid />,
    },
  ];

  const selectedToken = previewColumns > 1 ? 'double' : 'single';

  const viewChangeHandler = (token: string) => {
    const newColumns = token === 'double' ? 2 : 1;
    dispatch(uiActions.setPreviewColumns(newColumns));
  };

  const onFileOpen = useCallback(() => {
    onAction('fileOpen');
  }, [onAction]);

  const onSettings = useCallback(() => {
    onAction('settings');
  }, [onAction]);

  const onInfo = useCallback(() => {
    onAction('info');
  }, [onAction]);

  return (
    <div className="controls">
      <div className="controls-grid-buttons">
        <HappyButton token="settings" onClick={onInfo} depressed={false}>
          <img src={infoIcon} alt="" />
        </HappyButton>
        <HappyButton token="folder" onClick={onFileOpen} depressed={false}>
          <img src={folderIcon} alt="" />
        </HappyButton>
        <HappyButtonGroup
          buttonDescriptors={buttonDescriptors}
          selectedToken={selectedToken}
          onChange={viewChangeHandler}
        />
        <HappyButton token="settings" onClick={onSettings} depressed={false}>
          <img src={settingsIcon} alt="" />
        </HappyButton>
      </div>
    </div>
  );
};

export default Controls;

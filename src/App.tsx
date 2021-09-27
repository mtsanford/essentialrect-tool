import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ipcRenderer } from 'electron';

import SplitterLayout from 'react-splitter-layout';

import ImageRectTool from './components/ImageRectTool';
import ImageEssentialGrid from './components/ImageEssentialGrid';
import Controls from './components/Controls';

import { useAppSelector, useAppDispatch } from './store/hooks';
import { selectCurrentImage } from './store/current-image-slice';
import { setCurrentImage } from './store/current-image-actions';

import './App.global.css';
import './App.global.scss';

export default function App() {
  const dispatch = useAppDispatch();
  const [imageFolder, setImageFolderState] = useState(
    localStorage.getItem('imageFolder') || '/'
  );
  const { filePath } = useAppSelector(selectCurrentImage);

  // keyDownListener needs access to the value of imageFolder
  // on most recent render, not the one on first render which
  // would be captured as part of closure
  const imageFolderRef = useRef(imageFolder);
  const setImageFolder = (val) => {
    imageFolderRef.current = val;
    setImageFolderState(val);
  };

  const actionHandler = useCallback(
    (action: string) => {
      if (action === 'fileOpen') {
        const reply = ipcRenderer.sendSync(
          'select-file',
          filePath ? { defaultPath: filePath } : {}
        );
        if (reply) {
          const newImagePath = reply[0];
          dispatch(setCurrentImage(newImagePath));
        }
      }
    },
    [filePath]
  );

  useEffect(() => {
    const keydownListener = ({ key }) => {
      if (key === 'f') {
        fileOpenHandler();
      }
    };
    window.addEventListener('keydown', keydownListener);

    return () => window.removeEventListener('keydown', keydownListener);
  }, []);

  return (
    <SplitterLayout
      customClassName="imgjoy-splitter-layout"
      primaryMinSize={240}
      secondaryMinSize={650}
    >
      <div className="left-panel">
        <Controls onAction={actionHandler} />
        <div className="essential-grid-wrapper">
          <ImageEssentialGrid />
        </div>
      </div>
      <ImageRectTool />
    </SplitterLayout>
  );
}

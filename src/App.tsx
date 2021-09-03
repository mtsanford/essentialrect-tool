import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ipcRenderer } from 'electron';

import SplitterLayout from 'react-splitter-layout';

import ImageViewer from './components/ImageViewer';
import ImageEssentialGrid from './components/ImageEssentialGrid';
import Controls from './components/Controls';

import { setCurrentImage } from './store/current-image-actions';

import './App.global.css';
import './App.global.scss';

export default function App() {
  const dispatch = useDispatch();
  const [imageFolder, setImageFolderState] = useState(
    localStorage.getItem('imageFolder') || '/'
  );
  const { filePath } = useSelector((state) => state.currentImage);

  // keyDownListener needs access to the value of imageFolder
  // on most recent render, not the one on first render which
  // would be captured as part of closure
  const imageFolderRef = useRef(imageFolder);
  const setImageFolder = (val) => {
    imageFolderRef.current = val;
    setImageFolderState(val);
  };

  useEffect(() => {
    const keydownListener = ({ key }) => {
      if (key === 'f') {
        const reply = ipcRenderer.sendSync(
          'select-file',
          filePath ? { defaultPath: filePath } : {}
        );
        if (reply) {
          const newImagePath = reply[0];
          dispatch(setCurrentImage(newImagePath));
        }
      }
    };
    window.addEventListener('keydown', keydownListener);

    return () => window.removeEventListener('keydown', keydownListener);
  }, []);

  return (
    <SplitterLayout
      customClassName="imgjoy-splitter-layout"
      primaryMinSize={240}
      secondaryMinSize={240}
    >
      <div className="left-panel">
        <Controls />
        <div className="essential-grid-wrapper">
          <ImageEssentialGrid />
        </div>
      </div>
      <ImageViewer />
    </SplitterLayout>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { ipcRenderer } from 'electron';

import SplitterLayout from 'react-splitter-layout';

import log from './lib/log';

import RandomImages from './components/RandomImages';

import './App.global.css';
import './App.global.scss';

export default function App() {
  const [imageFolder, setImageFolderState] = useState(
    localStorage.getItem('imageFolder') || '/'
  );

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
        const reply = ipcRenderer.sendSync('select-dirs', {
          defaultPath: imageFolderRef.current,
        });
        if (reply) {
          const newImageFolder = reply[0];
          localStorage.setItem('imageFolder', newImageFolder);
          setImageFolder(newImageFolder);
        }
      }
    };
    window.addEventListener('keydown', keydownListener);

    return () => window.removeEventListener('keydown', keydownListener);
  }, []);

  return (
    <SplitterLayout>
      <RandomImages picFolder={imageFolder} />
      <div className="rightpane">hi</div>
    </SplitterLayout>
  );
}

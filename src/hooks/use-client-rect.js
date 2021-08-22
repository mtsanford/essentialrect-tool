import { useCallback, useRef, useState } from 'react';

const useClientRect = () => {
  const ref = useRef(null);
  const [resizeObserver, setResizeObserver] = useState(null);
  const [clientRect, setClientRect] = useState(null);

  const resizeHandler = useCallback((entries) => {
    const newClientRect = {
      left: 0,
      top: 0,
      width: entries[0].contentRect.width,
      height: entries[0].contentRect.height,
    };

    setClientRect(newClientRect);
  }, []);

  const setRef = useCallback((domElement) => {
    if (ref.current && resizeObserver) {
      resizeObserver.unobserve(ref.current);
    }

    if (domElement) {
      const ro = new ResizeObserver(resizeHandler);
      ro.observe(domElement);
      setResizeObserver(ro);
      // console.log('setRef have domElement');
    }
    ref.current = domElement;
  }, []);

  return [setRef, clientRect];
};

export default useClientRect;

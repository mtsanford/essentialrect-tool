import { useCallback, useRef, useState } from 'react';
import { Rect, emptyRect } from '../model/Rect';

const useClientRect = () => {
  const ref = useRef(null);
  const [resizeObserver, setResizeObserver] = useState<ResizeObserver>();
  const [clientRect, setClientRect] = useState<Rect>(emptyRect);

  const resizeHandler = useCallback((entries) => {
    const newClientRect: Rect = {
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
    }
    ref.current = domElement;
  }, []);

  return [setRef, clientRect] as const;
};

export default useClientRect;

import { useRef, useState, useCallback } from "react";
const useOnScreen = options => {
  const [visible, setVisible] = useState(false);
  const optionsRef = useRef(options);
  const observer = useRef();
  const ref = useCallback(
    node => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(([entry]) => {
        setVisible(entry.isIntersecting);
      }, optionsRef.current);
      observer.current.observe(node);
    },
    [optionsRef]
  );
  return [ref, visible];
};
export default useOnScreen;

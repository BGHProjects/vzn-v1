import { useEffect, useRef } from "react";

const useAnimationFrame = (callback: any, shouldAnimate = false) => {
  const frameRef = useRef(0);
  const timeRef = useRef();

  const animate = (time: any) => {
    if (timeRef.current) {
      const deltaTime = time - timeRef.current;
      callback(deltaTime);
    }

    timeRef.current = time;
    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (shouldAnimate) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(frameRef.current);
    }

    return () => cancelAnimationFrame(frameRef.current);
  }, [shouldAnimate]);
};

export default useAnimationFrame;

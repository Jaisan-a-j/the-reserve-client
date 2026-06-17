import { useEffect, useState, useRef } from "react";

export function useMinLoader(isLoading: boolean, minDuration = 1000) {
  const [loaderVisible, setLoaderVisible] = useState(false);
  const startTimeRef = useRef<number | null>(null);


  useEffect(() => {
    if (isLoading) {
      startTimeRef.current = Date.now();
      setLoaderVisible(true);
    } else if (loaderVisible && startTimeRef.current !== null) {
    
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, minDuration - elapsed);

      const timer = setTimeout(() => {
        setLoaderVisible(false);
        startTimeRef.current = null;
      }, remaining);

      return () => clearTimeout(timer);
    }
  }, [isLoading, loaderVisible, minDuration]);

  return isLoading || loaderVisible;
}
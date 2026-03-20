import { useEffect, useRef, useState } from "react";

// Generic hook to use a web worker for data transformation
export function useWorkerizedData(workerUrl, input, deps = []) {
  const workerRef = useRef();
  const [result, setResult] = useState(null);

  useEffect(() => {
    workerRef.current = new Worker(workerUrl, { type: "module" });
    const handleMessage = (e) => setResult(e.data);
    workerRef.current.addEventListener("message", handleMessage);
    workerRef.current.postMessage(input);
    return () => {
      workerRef.current.terminate();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return result;
}

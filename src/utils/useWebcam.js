import { useEffect, useRef, useState } from "react";

/**
 * Generic webcam stream hook, extracted out of the interview flow's CameraPreview so it can
 * be reused by the aptitude proctoring wrapper too (see useProctoring.js) - previously this
 * logic was tightly coupled inside CameraPreview.jsx itself.
 */
export default function useWebcam({ enabled = true } = {}) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setReady(true);
        setError(false);
      } catch {
        if (!cancelled) setError(true);
      }
    }
    if (enabled) start();
    else {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setReady(false);
    }
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [enabled]);

  return { videoRef, ready, error };
}

import React, { useState } from "react";
import { VideoOff, Camera } from "lucide-react";
import useWebcam from "../../utils/useWebcam";

export default function CameraPreview() {
  const [enabled, setEnabled] = useState(true);
  const { videoRef, error } = useWebcam({ enabled });

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden glass border border-line">
      {enabled && !error ? (
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-ink-4">
          <VideoOff size={24} />
          <span className="text-xs">Camera unavailable</span>
        </div>
      )}
      <button
        onClick={() => setEnabled((e) => !e)}
        className="absolute bottom-2 right-2 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70"
        aria-label="Toggle camera"
      >
        <Camera size={14} />
      </button>
    </div>
  );
}

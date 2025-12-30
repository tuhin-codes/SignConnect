import { useEffect, useRef, useState } from "react";

export default function CameraBox() {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);
  let streamRef = useRef(null);

  const startCamera = async () => {
    if (active) return;

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720 },
      audio: false,
    });

    streamRef.current = stream;
    videoRef.current.srcObject = stream;
    setActive(true);
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setActive(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="camera-wrapper">
      <div className="camera-stack">
        <video
          ref={videoRef}
          className="camera-video"
          autoPlay
          playsInline
          muted
        />
      </div>

      <div className="camera-controls">
        {!active ? (
          <button onClick={startCamera}>Start Camera</button>
        ) : (
          <button onClick={stopCamera}>Stop Camera</button>
        )}
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { Hands } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { useApp } from "../context/AppContext";

export default function SignCamera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);

  const lastSignRef = useRef("NONE");
  const stableCountRef = useRef(0);
  const lastDetectTimeRef = useRef(0);

  // 🔊 ADDED (voice memory)
  const lastSpokenSignRef = useRef("");

  const [cameraOn, setCameraOn] = useState(false);
  const [detectedSign, setDetectedSign] = useState("NONE");

  const { addToTimeline } = useApp();

  /* -------------------- VOICE (ADDED) -------------------- */
  const speakSign = (text) => {
    if (!window.speechSynthesis) return;
    if (lastSpokenSignRef.current === text) return;
    if (text === "UNKNOWN" || text === "NONE") return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.speechSynthesis.speak(utterance);
    lastSpokenSignRef.current = text;
  };

  /* -------------------- GEOMETRY HELPERS -------------------- */
  const dist = (a, b) =>
    Math.hypot(a.x - b.x, a.y - b.y);

  const palm = (lm) => lm[0];

  const fingerExtended = (tip, pip, lm) =>
    dist(tip, palm(lm)) > dist(pip, palm(lm)) + 0.035;

  const fingerFolded = (tip, pip, lm) =>
    dist(tip, palm(lm)) < dist(pip, palm(lm));

  // ✅ ADDED
  const fingerTouching = (a, b) => dist(a, b) < 0.045;

  /* -------------------- ONE HAND SIGNS -------------------- */
  const detectOneHand = (lm) => {
    const thumb = lm[4];
    const index = lm[8];
    const middle = lm[12];
    const ring = lm[16];
    const pinky = lm[20];

    const indexUp = fingerExtended(index, lm[6], lm);
    const middleUp = fingerExtended(middle, lm[10], lm);
    const ringUp = fingerExtended(ring, lm[14], lm);
    const pinkyUp = fingerExtended(pinky, lm[18], lm);
    const thumbUp = fingerExtended(thumb, lm[3], lm);

    const indexDown = fingerFolded(index, lm[6], lm);
    const middleDown = fingerFolded(middle, lm[10], lm);
    const ringDown = fingerFolded(ring, lm[14], lm);
    const pinkyDown = fingerFolded(pinky, lm[18], lm);

    /* -------- EXISTING RULES (UNCHANGED) -------- */

    if (
      thumbUp &&
      indexDown &&
      middleDown &&
      ringDown &&
      pinkyDown
    ) return "THUMBS UP";

    if (
      indexUp &&
      middleDown &&
      ringDown &&
      pinkyDown
    ) return "YOU";

    if (
      thumbUp &&
      indexDown &&
      middleDown &&
      ringDown
    ) return "ME";

    if (
      indexUp &&
      middleUp &&
      ringUp &&
      pinkyUp
    ) return "HELLO";

    if (
      indexUp &&
      middleUp &&
      ringUp &&
      pinkyUp &&
      thumbUp &&
      index.y < palm(lm).y
    ) return "THANK YOU";

    if (
      indexDown &&
      middleDown &&
      ringDown &&
      pinkyDown
    ) return "YES";

    /* -------- ADDED DAY-TO-DAY SIGNS -------- */

    // ❤️ LOVE
    if (
      thumbUp &&
      indexUp &&
      pinkyUp &&
      middleDown &&
      ringDown
    ) return "LOVE";

    // 👌 OKAY
    if (
      fingerTouching(thumb, index) &&
      middleUp &&
      ringUp &&
      pinkyUp
    ) return "OKAY";

    // ☎️ CALL ME
    if (
      thumbUp &&
      pinkyUp &&
      indexDown &&
      middleDown &&
      ringDown
    ) return "CALL ME";

    // ❌ NO
    if (
      indexDown &&
      middleDown &&
      ringUp &&
      pinkyUp
    ) return "NO";

    return "UNKNOWN";
  };

  /* -------------------- TWO HAND SIGNS -------------------- */
  const detectTwoHand = (h1, h2) => {
    const s1 = detectOneHand(h1);
    const s2 = detectOneHand(h2);

    if (s1 === s2 && s1 !== "UNKNOWN") return s1;

    if (
      fingerFolded(h1[8], h1[6], h1) &&
      fingerFolded(h2[8], h2[6], h2)
    ) return "YES";

    if (
      fingerExtended(h1[8], h1[6], h1) &&
      fingerExtended(h2[8], h2[6], h2)
    ) return "STOP";

    return "UNKNOWN";
  };

  /* -------------------- MEDIAPIPE -------------------- */
  useEffect(() => {
    if (!cameraOn) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.75,
      minTrackingConfidence: 0.75,
    });

    hands.onResults((results) => {
      if (!video.videoWidth) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!results.multiHandLandmarks) {
        lastSignRef.current = "NONE";
        stableCountRef.current = 0;
        lastSpokenSignRef.current = "";
        setDetectedSign("NONE");
        return;
      }

      results.multiHandLandmarks.forEach((lm) => {
        drawConnectors(ctx, lm, HAND_CONNECTIONS, {
          color: "#22c55e",
          lineWidth: 2,
        });
        drawLandmarks(ctx, lm, {
          color: "#22c55e",
          radius: 3,
        });
      });

      const now = Date.now();
      if (now - lastDetectTimeRef.current < 220) return;
      lastDetectTimeRef.current = now;

      let sign = "UNKNOWN";

      if (results.multiHandLandmarks.length === 1) {
        sign = detectOneHand(results.multiHandLandmarks[0]);
      } else if (results.multiHandLandmarks.length === 2) {
        sign = detectTwoHand(
          results.multiHandLandmarks[0],
          results.multiHandLandmarks[1]
        );
      }

      if (sign === lastSignRef.current) {
        stableCountRef.current++;
      } else {
        stableCountRef.current = 0;
      }

      if (stableCountRef.current === 3 && sign !== "UNKNOWN") {
        setDetectedSign(sign);
        addToTimeline(sign, "sign");
        speakSign(sign); // 🔊 ADDED
      }

      lastSignRef.current = sign;
    });

    cameraRef.current = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 640,
      height: 360,
    });

    cameraRef.current.start();

    return () => {
      cameraRef.current?.stop();
      hands.close();
      window.speechSynthesis.cancel();
    };
  }, [cameraOn]);

  /* -------------------- UI -------------------- */
  return (
    <div className="camera-wrapper">
      <div className="camera-stack">
        <div className="ai-avatar">
          <div className="ai-core"></div>
          <div className="ai-ring"></div>
        </div>

        <video ref={videoRef} className="camera-video" autoPlay muted />
        <canvas ref={canvasRef} className="camera-canvas" />
      </div>

      <div className="camera-controls">
        {!cameraOn ? (
          <button onClick={() => setCameraOn(true)}>Start Camera</button>
        ) : (
          <button onClick={() => setCameraOn(false)}>Stop Camera</button>
        )}
      </div>

      <div className="detected-sign">
        Detected Sign: <strong>{detectedSign}</strong>
        <div className={`voice-wave ${detectedSign !== "NONE" ? "active" : ""}`}>
          <span></span><span></span><span></span><span></span>
        </div>

      </div>
    </div>
  );
}

import { useEffect } from "react";
import SignCamera from "./SignCamera";
import TextToSign from "./TextToSign";
import VoiceToSign from "./VoiceToSign";
import { useApp } from "../context/AppContext";

export default function MainBox({ mode, demoMode }) {
  const { addToTimeline } = useApp();

  // 🔥 DEMO MODE AUTO-PLAY
  useEffect(() => {
    if (!demoMode) return;

    const demoSigns = ["HELLO", "THANK YOU", "YES", "NO", "PLEASE"];
    let index = 0;

    const interval = setInterval(() => {
      addToTimeline(demoSigns[index], "demo");
      index = (index + 1) % demoSigns.length;
    }, 2500);

    return () => clearInterval(interval);
  }, [demoMode, addToTimeline]);

  // 🚫 BLOCK REAL INPUTS DURING DEMO
  if (demoMode) {
    return (
      <div className="main-box demo-placeholder">
        <h2>Demo Mode Active</h2>
        <p>
          Live camera, microphone, and typing are disabled during demo.
        </p>
        <p style={{ opacity: 0.7 }}>
          Turn off Demo to use real-time features.
        </p>
      </div>
    );
  }

  // ✅ NORMAL MODES
  return (
    <div className="main-box">
      {mode === "sign" && <SignCamera />}
      {mode === "text" && <TextToSign />}
      {mode === "voice" && <VoiceToSign />}
    </div>
  );
}

import { useState, useRef } from "react";
import AvatarPlayer from "./Avatar/AvatarPlayer";

export default function VoiceToSign() {
  const [listening, setListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [activeSign, setActiveSign] = useState("IDLE");
  const [playId, setPlayId] = useState(0);

  const recognitionRef = useRef(null);

  // SAME animation list as TextToSign
  const signs = [
    "HELLO",
    "YES",
    "NO",
    "OKAY",
    "OK",              // ✅ ADDED
    "WHAT",
    "YOU",
    "THANKYOU",
    "THANKS",          // ✅ ADDED
    "PLEASE",
    "ANGRY",
    "WHERE",
    "SURPRISED",
    "THINKING",
    "LOOKAROUND",
    "IDLE",            // ✅ ADDED
  ];

  // ✅ ADDED — speech normalization helper
  const normalizeSpeech = (text) => {
    if (text.includes("THANK")) return "THANKS";
    if (text.includes("OK")) return "OKAY";
    return text;
  };

  const startListening = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setSpokenText("");
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toUpperCase();
      const normalizedText = normalizeSpeech(text); // ✅ ADDED

      setSpokenText(text);

      let found = "IDLE";
      for (let s of signs) {
        if (normalizedText.includes(s)) { // ✅ uses normalized text
          found = s;
          break;
        }
      }

      setActiveSign(found);
      setPlayId((p) => p + 1);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopAnimation = () => {
    setActiveSign("IDLE");
    setPlayId((p) => p + 1);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Voice → Sign</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "14px",
          marginTop: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={startListening}
          disabled={listening}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: listening ? "#475569" : "#16a34a",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          🎤 {listening ? "Listening..." : "Start Voice"}
        </button>

        <button
          onClick={stopAnimation}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#dc2626",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ⏹ Stop
        </button>
      </div>

      {spokenText && (
        <p style={{ marginTop: "12px", opacity: 0.8 }}>
          Heard: <b>{spokenText}</b>
        </p>
      )}

      <div
        style={{
          width: "360px",
          height: "460px",
          margin: "30px auto",
          borderRadius: "16px",
          background: "#0b1220",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <AvatarPlayer key={playId} sign={activeSign} />
      </div>
    </div>
  );
}

import { useState } from "react";
import AvatarPlayer from "./Avatar/AvatarPlayer";

export default function TextToSign() {
  const [text, setText] = useState("");
  const [activeSign, setActiveSign] = useState("IDLE");
  const [playId, setPlayId] = useState(0);

  const playSign = () => {
    if (!text.trim()) return;

    const input = text.toUpperCase();

    const signs = [
      "HELLO",
      "YES",
      "NO",
      "OKAY",
      "OK",            // ✅ ADDED
      "WHAT",
      "YOU",
      "THANKS",
      "PLEASE",
      "ANGRY",
      "WHERE",
      "SURPRISED",
      "THINKING",
      "LOOKAROUND",
      "IDLE",          // ✅ ADDED
    ];

    let found = "IDLE";
    for (let s of signs) {
      if (input.includes(s)) {
        found = s;
        break;
      }
    }

    setActiveSign(found);
    setPlayId((p) => p + 1);
  };

  const stopSign = () => {
    setActiveSign("IDLE");
    setPlayId((p) => p + 1);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Text → Sign</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "14px",
          marginTop: "12px",
          flexWrap: "wrap",
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="ARE YOU OKAY / THANKS"
          style={{
            width: "220px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #334155",
            background: "#020617",
            color: "#fff",
          }}
        />

        <button
          onClick={playSign}
          style={{
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          ▶ Play
        </button>

        <button
          onClick={stopSign}
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

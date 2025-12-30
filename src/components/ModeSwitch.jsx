export default function ModeSwitch({ mode, setMode }) {
  return (
    <div className="mode-row">
      <div
        className={`mode-card ${mode === "sign" ? "active" : ""}`}
        onClick={() => setMode("sign")}
      >
        <div className="mode-icon">✋</div>
        <h4>Sign → Text / Voice</h4>
        <p>Use camera to detect sign language</p>
      </div>

      <div
        className={`mode-card ${mode === "voice" ? "active" : ""}`}
        onClick={() => setMode("voice")}
      >
        <div className="mode-icon">🎤</div>
        <h4>Voice → Sign</h4>
        <p>Speak and see sign animation</p>
      </div>

      <div
        className={`mode-card ${mode === "text" ? "active" : ""}`}
        onClick={() => setMode("text")}
      >
        <div className="mode-icon">⌨</div>
        <h4>Text → Sign</h4>
        <p>Type text and view sign avatar</p>
      </div>
    </div>
  );
}

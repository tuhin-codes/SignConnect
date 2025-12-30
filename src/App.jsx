import { useEffect, useState } from "react";
import Header from "./components/Header";
import ModeSwitch from "./components/ModeSwitch";
import MainBox from "./components/MainBox";
import ConversationTimeline from "./components/ConversationTimeline";
import "./index.css";

export default function App() {
  const [mode, setMode] = useState("sign");
  const [demoMode, setDemoMode] = useState(false);

  // 🔁 AUTO MODE SWITCH DURING DEMO
  useEffect(() => {
    if (!demoMode) return;

    const modes = ["sign", "voice", "text"];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % modes.length;
      setMode(modes[index]);
    }, 6000);

    return () => clearInterval(interval);
  }, [demoMode]);

  return (
    <div className="netflix-root">
      {/* HEADER */}
      <Header
        demoMode={demoMode}
        onDemoToggle={() => setDemoMode((d) => !d)}
      />

      <main className="netflix-content">
        {/* HERO + MODES + CAMERA (ONE CENTERED COLUMN) */}
        <section className="hero-section">
          <div className="hero-container">
            {/* HERO TEXT */}
            <div className="hero-overlay">
              <h1 className="hero-title">SIGNCONNECT</h1>
              <p className="hero-subtitle">
                Breaking communication barriers with AI
              </p>

              <div className="hero-tags">
                <span>Live Sign</span>
                <span>Voice</span>
                <span>Text</span>
              </div>

              {demoMode && <div className="demo-badge">DEMO MODE</div>}
            </div>

            {/* MODE CARDS (ABOVE CAMERA ✅) */}
            <div className="modes-wrapper">
              <ModeSwitch mode={mode} setMode={setMode} />
            </div>

            {/* CAMERA BOX (CENTERED ✅) */}
            <MainBox mode={mode} demoMode={demoMode} />
          </div>
        </section>

        {/* TIMELINE */}
        <section className="timeline-section">
          <ConversationTimeline />
        </section>
      </main>
    </div>
  );
}

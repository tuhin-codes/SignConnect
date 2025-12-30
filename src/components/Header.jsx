import { useState } from "react";
import AIChatBox from "./AIChatBox";

export default function Header() {
  const [openChat, setOpenChat] = useState(false);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          {/* LEFT */}
          <div className="header-left">
            <div className="logo-circle">SC</div>
            <span className="logo-text">SignConnect</span>
          </div>

          {/* RIGHT */}
          <div className="header-right">
            <button className="nav-btn">Help</button>

            {/* 🔥 CHAT BUTTON */}
            <button
              className="nav-btn"
              onClick={() => setOpenChat(true)}
            >
              Chat with Us
            </button>

            <button className="nav-btn logout">Logout</button>
            <button className="nav-btn demo">Demo</button>
          </div>
        </div>
      </header>

      {/* 🔥 AI CHAT MODAL */}
      {openChat && <AIChatBox onClose={() => setOpenChat(false)} />}
    </>
  );
}

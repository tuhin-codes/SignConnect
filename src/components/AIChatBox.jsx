import { useState } from "react";
import "./AIChatBox.css";

/* =========================
   AI INTELLIGENCE FUNCTION
========================= */
const getAIReply = (message) => {
  const text = message.toLowerCase().trim();

  // Greetings
  if (["hi", "hello", "hey"].includes(text)) {
    return "Hi 👋 I’m SignConnect AI. How can I help you today?";
  }

  // Thanks
  if (text.includes("thank")) {
    return "You're welcome 😊 Happy to help!";
  }

  // Help
  if (text.includes("help")) {
    return "I can help you with sign language, voice-to-sign, text-to-sign, and using this application.";
  }

  // Sign related
  if (text.includes("sign")) {
    return "Sign language uses hand gestures and expressions to communicate. Try Live Sign, Voice → Sign, or Text → Sign above.";
  }

  // Default fallback
  return `I understood: "${message}". Tell me more 🙂`;
};

/* =========================
   AI CHAT COMPONENT
========================= */
export default function AIChatBox({ onClose }) {
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hello 👋 I’m SignConnect AI. How can I help you today?" }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMessage = input;

    // Add user message
    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);

    // Generate AI reply
    const aiReply = getAIReply(userMessage);

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "ai", text: aiReply }]);
    }, 600);

    setInput("");
  };

  return (
    <div className="ai-chat-overlay">
      <div className="ai-chat-box">
        {/* HEADER */}
        <div className="ai-chat-header">
          <div className="ai-brain" />
          <div>
            <h4>SignConnect AI</h4>
            <span>Multimodal Assistant</span>
          </div>
          <button onClick={onClose}>✕</button>
        </div>

        {/* MESSAGES */}
        <div className="ai-chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`ai-msg ${msg.from === "user" ? "user" : "ai"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="ai-chat-input">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask SignConnect AI..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>➤</button>
        </div>
      </div>
    </div>
  );
}

import { useApp } from "../context/AppContext";

export default function ConversationTimeline() {
  const { timeline } = useApp();

  return (
    <div className="conversation-box">
      <h3 className="timeline-title">Conversation Timeline</h3>

      {timeline.length === 0 ? (
        <p className="empty-text">No conversation yet</p>
      ) : (
        <ul className="timeline-list">
          {timeline.map((item) => (
            <li key={item.id} className="timeline-item">
              <span className="sign">{item.text}</span>
              <span className="time">{item.time}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

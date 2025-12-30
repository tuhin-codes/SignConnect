import { useApp } from "../context/AppContext";

export default function Timeline() {
  const { timeline } = useApp();

  return (
    <div className="timeline">
      <h3>Conversation Timeline</h3>
      {timeline.length === 0 && (
        <p className="empty">No interactions yet</p>
      )}
    </div>
  );
}

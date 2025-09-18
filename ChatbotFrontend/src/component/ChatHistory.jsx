import ChatMessage from "./ChatMessage";

export default function ChatHistory({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} role={msg.role} content={msg.content} />
      ))}
    </div>
  );
}

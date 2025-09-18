import SessionSwitcher from "./SessionSwitcher";

export default function ChatHeader({ sessionId, setSessionId }) {
  return (
    <div className="bg-blue-600 text-white p-4 text-lg font-bold shadow-md flex justify-between items-center">
      <span>🤖 RAG Chatbot</span>
      <SessionSwitcher sessionId={sessionId} setSessionId={setSessionId} />
    </div>
  );
}

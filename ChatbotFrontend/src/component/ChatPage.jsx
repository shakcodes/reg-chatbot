import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const API_URL = "http://localhost:5000/api";

export default function ChatPage() {
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const sessionId = "test123";

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: input }]);

    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        sessionid: sessionId,
      },
      body: JSON.stringify({ question: input }),
    });
    const data = await res.json();
    if (data?.answer) {
      setMessages(data.history);
    }
    setInput("");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto bg-white p-4 rounded shadow">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 p-2 rounded ${
              msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-200 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="p-2 flex border-t bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 p-2 border rounded mr-2"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

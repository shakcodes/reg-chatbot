import { Send } from "lucide-react";

export default function ChatInput({ input, setInput, sendMessage }) {
  return (
    <div className="p-4 bg-white flex items-center space-x-2 border-t">
      <input
        type="text"
        className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        onClick={sendMessage}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}

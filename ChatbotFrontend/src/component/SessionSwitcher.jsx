import { useState } from "react";

export default function SessionSwitcher({ sessionId, setSessionId }) {
  const [newId, setNewId] = useState("");

  const handleSwitch = () => {
    if (newId.trim()) {
      setSessionId(newId.trim());
      setNewId("");
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="text"
        placeholder="Enter session ID"
        value={newId}
        onChange={(e) => setNewId(e.target.value)}
        className="px-2 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSwitch}
        className="bg-white text-blue-600 font-bold px-3 py-1 rounded-md shadow hover:bg-gray-100"
      >
        Switch
      </button>
      <span className="ml-3 text-sm text-gray-200">
        Active: <b>{sessionId}</b>
      </span>
    </div>
  );
}

import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const API_URL = "http://localhost:5000/api";

export default function SessionsPage() {
  const { token } = useContext(AuthContext);
  const [sessions, setSessions] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_URL}/session`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSessions(data.sessions || {});
    } catch (err) {
      console.error("❌ Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [token]);

  const deleteSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;

    try {
      const res = await fetch(`${API_URL}/session/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("✅ Deleted:", data);
      // Update UI
      const updated = { ...sessions };
      delete updated[id];
      setSessions(updated);
    } catch (err) {
      console.error("❌ Error deleting session:", err);
    }
  };

  if (loading) return <p className="text-center p-4">⏳ Loading sessions...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🗂 My Sessions</h1>

      {Object.keys(sessions).length === 0 ? (
        <p className="text-gray-500">No sessions yet. Start chatting!</p>
      ) : (
        <ul className="space-y-3">
          {Object.entries(sessions).map(([id, title]) => (
            <li
              key={id}
              className="flex justify-between items-center p-3 border rounded-lg bg-white shadow hover:bg-gray-50"
            >
              <Link to={`/session/${id}`} className="text-blue-600 font-medium">
                {title}
              </Link>
              <button
                onClick={() => deleteSession(id)}
                className="ml-4 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

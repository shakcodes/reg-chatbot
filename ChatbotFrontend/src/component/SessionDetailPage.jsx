import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const API_URL = "http://localhost:5000/api";

export default function SessionDetailPage() {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/session/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setHistory(data.history || []);
      } catch (err) {
        console.error("❌ Error fetching session history:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [id, token]);

  if (loading) return <p className="text-center p-4">⏳ Loading chat...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">💬 Session: {id}</h1>

      <div className="bg-white p-4 rounded shadow space-y-2">
        {history.length === 0 ? (
          <p className="text-gray-500">No messages in this session.</p>
        ) : (
          history.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded ${
                msg.role === "user"
                  ? "bg-blue-100 text-right"
                  : "bg-gray-200 text-left"
              }`}
            >
              <span className="font-medium">{msg.role}: </span>
              {msg.content}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

import { Routes, Route, Link } from "react-router-dom";
import SessionsPage from "./component/SessionsPage";
import SessionDetailPage from "./component/SessionDetailPage";
import ChatPage from "./component/ChatPage";
import Login from "./component/Login";
import Signup from "./component/Signup";
import { AuthContext } from "./contexts/AuthContext";
import { useContext } from "react";

export default function App() {
  const { token, logout } = useContext(AuthContext);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <div className="font-bold">🤖 RAG Chatbot</div>
        <div className="space-x-4">
          {token && <Link to="/sessions">My Sessions</Link>}
          {!token ? (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/signup" className="hover:underline">
                Signup
              </Link>
            </>
          ) : (
            <button onClick={logout} className="hover:underline">
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Routes */}
      <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
        <Routes>
          <Route path="/" element={token ? <ChatPage /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/sessions" element={<SessionsPage />} />
          <Route path="/session/:id" element={<SessionDetailPage />} />
        </Routes>
      </div>
    </div>
  );
}

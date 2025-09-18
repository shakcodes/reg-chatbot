import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow-md flex justify-between items-center">
      {/* Left: Brand */}
      <Link to="/" className="text-xl font-bold">
        🤖 RAG Chatbot
      </Link>

      {/* Right: Links */}
      <div className="flex space-x-4">
        {!token ? (
          <>
            <Link
              to="/login"
              className="hover:bg-blue-700 px-3 py-1 rounded-md"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:bg-blue-700 px-3 py-1 rounded-md"
            >
              Signup
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/chat"
              className="hover:bg-blue-700 px-3 py-1 rounded-md"
            >
              Chat
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

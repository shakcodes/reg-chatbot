import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const API_URL = "http://localhost:5000/api/auth";

export default function Signup() {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");
      login(data); // auto login after signup
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Signup</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />
      <button
        onClick={handleSignup}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Signup
      </button>
    </div>
  );
}

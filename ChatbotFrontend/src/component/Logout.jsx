import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Logout() {
  const { logout } = useContext(AuthContext);

  return (
    <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
      Logout
    </button>
  );
}

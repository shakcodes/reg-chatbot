import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

export default function ChatMessage({ role, content }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start space-x-2 ${
        role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      {role === "bot" && <Bot className="w-6 h-6 text-blue-500 mt-1" />}
      <div
        className={`px-4 py-2 rounded-2xl shadow max-w-[70%] ${
          role === "user"
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none"
        }`}
      >
        {content}
      </div>
      {role === "user" && <User className="w-6 h-6 text-gray-600 mt-1" />}
    </motion.div>
  );
}

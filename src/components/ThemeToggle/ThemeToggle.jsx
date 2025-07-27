// src/components/ThemeToggle.jsx
import { useTheme } from "@/context/ThemeProvider";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="text-2xl p-2 hover:scale-110 transition"
      title="Toggle Theme"
    >
      {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800 dark:text-white" />}
    </button>
  );
};

export default ThemeToggle;

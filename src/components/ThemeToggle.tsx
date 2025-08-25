"use client"
import { useEffect, useState } from "react"

export default function ThemeToggle() {
    const [dark, setDark] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") {
            document.documentElement.classList.add("dark");
            setDark(true);
        }
    }, []);

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.toggle("dark");
        setDark(isDark);
        localStorage.setItem("theme", isDark ? "dark" : "light");
    };

    return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded bg-footer-bg text-footer-text transition"
    >
      {dark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
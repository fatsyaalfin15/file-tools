import { useEffect, useState } from "react";

const KEY = "filetools-theme";

function initial(): boolean {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return saved === "dark";
  } catch {
    // abaikan
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useDarkMode() {
  const [dark, setDark] = useState(initial);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(KEY, dark ? "dark" : "light");
    } catch {
      // abaikan
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
}

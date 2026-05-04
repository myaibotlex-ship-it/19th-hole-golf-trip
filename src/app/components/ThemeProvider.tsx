"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";

const ThemeContext = createContext<{
  theme: "light";
  resolved: "light";
  toggle: () => void;
}>({ theme: "light", resolved: "light", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, []);

  return (
    <ThemeContext value={{ theme: "light", resolved: "light", toggle: () => {} }}>
      {children}
    </ThemeContext>
  );
}

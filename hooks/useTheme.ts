"use client";

import { useEffect, useState } from "react";

export function useTheme() {
  const [isLight, setIsLight] = useState(
    () => typeof window !== "undefined" && localStorage.getItem("theme") === "light"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("light", isLight);
    setTimeout(() => document.documentElement.classList.remove("no-transition"), 50);
  }, [isLight]);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("theme", next ? "light" : "dark");
  };

  return { isLight, toggleTheme };
}

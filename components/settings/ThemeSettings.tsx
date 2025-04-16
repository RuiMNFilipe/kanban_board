"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { useEffect, useState } from "react";

type ThemeOptions = {
  value: "light" | "dark" | "system";
  label: string;
  description: string;
};

const themeOptions: ThemeOptions[] = [
  {
    value: "light",
    label: "Light",
    description: "Light theme for bright environments",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Dark theme for low-light environments",
  },
  {
    value: "system",
    label: "System",
    description: "Follows your system theme preferences",
  },
];

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Choose the appearance of the application.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {themeOptions.map((option) => (
          <div
            key={option.value}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              theme === option.value
                ? "border-primary bg-secondary"
                : "hover:border-primary/50"
            }`}
            onClick={() => setTheme(option.value)}
          >
            <div className="font-medium mb-1">{option.label}</div>
            <div className="text-sm text-muted-foreground">
              {option.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

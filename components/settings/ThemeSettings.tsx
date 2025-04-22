"use client";

import { useTheme } from "@/providers/ThemeProvider";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

      <RadioGroup
        value={theme}
        onValueChange={setTheme}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {themeOptions.map((option) => (
          <div
            key={option.value}
            className={`border rounded-lg p-4 cursor-pointer transition-all
              ${
                theme === option.value
                  ? "border-primary bg-secondary"
                  : "hover:border-primary/50"
              }`}
          >
            <RadioGroupItem
              value={option.value}
              className="sr-only"
              id={`theme-${option.value}`}
            />
            <Label
              htmlFor={`theme-${option.value}`}
              className="flex flex-col space-y-1 cursor-pointer peer-checked:text-primary"
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-muted-foreground">
                {option.description}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}

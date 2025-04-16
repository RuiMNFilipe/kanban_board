"use client";

import { ThemeSettings } from "@/components/settings/ThemeSettings";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <ThemeSettings />
      </div>
    </div>
  );
}

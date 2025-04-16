"use client";

import { BoardForm } from "@/components/board/BoardForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewBoardPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/boards"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to boards</span>
        </Link>
      </div>

      <BoardForm />

      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Quick Tips</h3>
        <ul className="text-blue-700 space-y-2">
          <li>• Create columns for different stages of your workflow</li>
          <li>• Drag and drop tasks between columns to update their status</li>
          <li>• Use labels and priorities to organize your tasks</li>
        </ul>
      </div>
    </div>
  );
}

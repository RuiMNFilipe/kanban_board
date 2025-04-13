"use client";

import { useState } from "react";
import CreateTaskForm from "@/components/CreateTaskForm";

export default function BoardDetailPageClient({
  userId,
  columnId,
}: {
  userId: string;
  columnId: string;
}) {
  const [showCreateTaskForm, setShowCreateTaskForm] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowCreateTaskForm(!showCreateTaskForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={!columnId}
      >
        {showCreateTaskForm ? "Close Form" : "Create Task"}
      </button>
      {showCreateTaskForm && columnId && (
        <div className="mt-4">
          <CreateTaskForm
            userId={userId}
            columnId={columnId}
            onClose={() => setShowCreateTaskForm(false)}
          />
        </div>
      )}
      {!columnId && <p>No columns available.</p>}
    </div>
  );
}

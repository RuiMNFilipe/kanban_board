"use client";

import { useState } from "react";

import CreateTaskForm from "@/components/task/CreateTaskForm";
import { Button } from "@/components/ui/button";

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
      <Button
        onClick={() => setShowCreateTaskForm(!showCreateTaskForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold hover:cursor-pointer"
        disabled={!columnId}
      >
        {showCreateTaskForm ? "Close Form" : "Create Task"}
      </Button>
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

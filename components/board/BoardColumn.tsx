"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Column, Task } from "@prisma/client";
import TaskItem from "@/components/task/TaskItem";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import TaskModal from "@/components/task/TaskModal";

type ColumnProps = {
  column: Column;
  tasks: Task[];
  boardId: string;
  onTaskCreate: (task: Task) => void;
};

export default function BoardColumn({
  column,
  tasks,
  boardId,
  onTaskCreate,
}: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const [modalOpen, setModalOpen] = useState(false);

  const handleAddTask = () => {
    setModalOpen(true);
  };

  return (
    <div ref={setNodeRef} className="bg-gray-100 rounded-lg p-4 w-80">
      <h2 className="font-bold mb-4">{column.name}</h2>
      {tasks.length > 0 ? (
        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </SortableContext>
      ) : (
        <h2>No tasks added yet</h2>
      )}
      <Button className="mt-2 hover:cursor-pointer" onClick={handleAddTask}>
        Add Task
      </Button>
      {modalOpen && (
        <TaskModal
          boardId={boardId}
          columnId={column.id}
          columnName={column.name}
          onClose={() => setModalOpen(false)}
          open={modalOpen}
          onTaskCreate={onTaskCreate}
          setOpen={setModalOpen}
        />
      )}
    </div>
  );
}

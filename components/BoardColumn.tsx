"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task } from "@prisma/client";
import TaskItem from "./TaskItem";

type Column = {
  id: string;
  name: string;
};

type ColumnProps = {
  column: Column;
  tasks: Task[];
};

export default function BoardColumn({ column, tasks }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

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
    </div>
  );
}

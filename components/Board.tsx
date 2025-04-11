"use client";

import { Column, Task } from "@prisma/client";
import BoardColumn from "./BoardColumn";
import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import TaskItem from "./TaskItem";

type BoardProps = {
  columns: Column[];
  tasks: Task[];
};

export default function Board({ columns, tasks }: BoardProps) {
  const [columnState, setColumnState] = useState<Column[]>(columns);
  const [taskState, setTaskState] = useState<Task[]>(tasks);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    let updatedTasks = [...taskState];

    const activeTask = updatedTasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    let overColumnId: string;

    if (over.id === activeTask.columnId) {
      overColumnId = over.id;
    } else {
      if (updatedTasks.find((task) => task.id === over.id)) {
        overColumnId = updatedTasks.find(
          (task) => task.id === over.id
        )!.columnId;
      } else {
        overColumnId = String(over.id);
      }
    }

    const overColumn = columnState.find((column) => column.id === overColumnId);

    if (activeTask && overColumn) {
      const activeTaskIndex = updatedTasks.findIndex(
        (task) => task.id === activeTask.id
      );
      const overTaskIndex = updatedTasks.findIndex(
        (task) => task.id === over.id
      );

      if (overColumnId === activeTask.columnId) {
        // Reorder in same column
        updatedTasks = arrayMove(updatedTasks, activeTaskIndex, overTaskIndex);
        updatedTasks = updatedTasks.map((task, index) => {
          if (task.columnId === overColumnId) {
            return { ...task, position: index };
          }
          return task;
        });
      } else {
        // Change columns
        const newTask = { ...activeTask, columnId: overColumnId };
        updatedTasks = updatedTasks.filter((task) => task.id !== active.id);
        updatedTasks.splice(overTaskIndex, 0, newTask);

        const overColumnTasks = updatedTasks.filter(
          (task) => task.columnId === overColumnId
        );

        updatedTasks = updatedTasks.map((task) => {
          if (task.columnId === overColumnId) {
            const position = overColumnTasks.find(
              (t) => t.id === task.id
            )!.position;
            return { ...task, position: position };
          }
          return task;
        });
      }
      setTaskState(updatedTasks);
      setActiveTaskId(null);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    if (event.active) {
      setActiveTaskId(event.active.id.toString());
    } else {
      setActiveTaskId(null);
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <div className="flex overflow-x-auto gap-4">
        {columnState.map((column) => (
          <BoardColumn
            key={column.id}
            column={column}
            tasks={taskState.filter((task) => task.columnId === column.id)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTaskId ? (
          <TaskItem
            task={taskState.find((task) => task.id === activeTaskId)!}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

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

    const activeTask = taskState.find((task) => task.id === active.id);
    if (!activeTask) return;

    // Determine column ID
    let overColumnId: string;

    if (over.id === activeTask?.columnId) {
      // Reordered within the same column
      overColumnId = over.id;
    } else {
      // Determine the same column ID from the taskState or over.id
      if (taskState.find((task) => task.id === over.id)) {
        overColumnId = activeTask!.columnId;
      } else {
        overColumnId = String(over.id);
      }
    }

    const overColumn = columnState.find((column) => column.id === overColumnId);

    if (activeTask && overColumn) {
      const activeTaskIndex = taskState.findIndex(
        (task) => task.id === active.id
      );
      const overTaskIndex = taskState.findIndex((task) => task.id === over.id);

      let updatedTasks = taskState.map((task) =>
        task.id === activeTask.id ? { ...task, columnId: overColumn.id } : task
      );

      let newPosition = 0;
      if (taskState.find((task) => task.id === over.id)) {
        newPosition = taskState.findIndex((task) => task.id === over.id);
      } else {
        newPosition = updatedTasks.filter(
          (task) => task.columnId === overColumnId
        ).length;
      }

      // Adjust positions in the target column
      updatedTasks = updatedTasks.map((task) => {
        if (task.columnId === overColumn.id && task.id !== activeTask.id) {
          if (task.position >= newPosition) {
            return { ...task, position: task.position + 1 };
          }
        }
        return task;
      });

      setTaskState(updatedTasks);

      if (overColumn.id === activeTask.columnId) {
        // Reorder in same column
        updatedTasks = arrayMove(taskState, activeTaskIndex, overTaskIndex);
        updatedTasks = updatedTasks.map((task, index) => {
          if (task.columnId === overColumnId) {
            return { ...task, position: index };
          }
          return task;
        });
      } else {
        // Moved to a different column

        const newTask = { ...activeTask, columnId: overColumnId };
        updatedTasks = updatedTasks.filter((task) => task.id !== active.id);
        updatedTasks.splice(overTaskIndex, 0, newTask);

        const overColumnTasks = updatedTasks.filter(
          (task) => task.columnId === overColumnId
        );

        updatedTasks = updatedTasks.map((task) => {
          if (task.columnId === overColumnId) {
            const position = overColumnTasks.findIndex((t) => t.id === task.id);
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

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@prisma/client";
import { HTMLAttributes } from "react";

export default function TaskItem({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style: HTMLAttributes<HTMLDivElement>["style"] = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-4 mb-2 rounded shadow ${
        isDragging ? "bg-slate-200" : "bg-white"
      }`}
    >
      <h3 className="font-medium">{task.title}</h3>
    </div>
  );
}

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@prisma/client";
import { X } from "lucide-react";
import { HTMLAttributes, useState } from "react";
import { Button } from "./ui/button";
import ConfirmationModal from "./ConfirmationModal";

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

  const [isHovered, setIsHovered] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    setConfirmationOpen(true);
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center justify-between p-4 mb-2 rounded shadow min-h-[68px] ${
        isDragging ? "bg-slate-200" : "bg-white"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={style} {...attributes} {...listeners} className="flex-1">
        <h3 className="font-medium">{task.title}</h3>
      </div>
      {isHovered && (
        <Button
          className="bg-red-500 hover:bg-red-600 hover:cursor-pointer"
          onClick={handleClick}
        >
          <X />
        </Button>
      )}
      {confirmationOpen && (
        <ConfirmationModal
          modalTitle={`Are you sure you want to delete ${task.title}?`}
          onClose={() => setConfirmationOpen(false)}
          open={confirmationOpen}
          setOpen={setConfirmationOpen}
        />
      )}
    </div>
  );
}

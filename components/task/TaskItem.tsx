"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@prisma/client";
import { X } from "lucide-react";
import { HTMLAttributes, useState } from "react";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/custom/ConfirmationModal";
import deleteTaskAction from "@/actions/tasks/deleteTask";

type TaskItemProps = {
  task: Task;
  onTaskDelete: (task: Task) => void;
};

export default function TaskItem({ task, onTaskDelete }: TaskItemProps) {
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

  async function handleTaskDelete(deleteTaskId: string) {
    try {
      const result = await deleteTaskAction(deleteTaskId);

      if (result.success) {
        alert(`Task ${result.deletedTask?.title} deleted successfully!`);
        onTaskDelete(result.deletedTask!);
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.log(error);
    }
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
          onConfirm={() => handleTaskDelete(task.id)}
        />
      )}
    </div>
  );
}

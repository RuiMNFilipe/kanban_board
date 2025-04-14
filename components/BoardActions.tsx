"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import deleteBoardAction from "@/actions/deleteBoard";

type BoardActionsProps = {
  boardId: string;
  onEdit: () => void;
};

export default function BoardActions({ boardId, onEdit }: BoardActionsProps) {
  async function onDelete(boardId: string) {
    try {
      const result = await deleteBoardAction(boardId);

      if (!result.success) {
        console.error(result.error);
      }

      console.log(`Board with ID ${boardId} deleted successfully!`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex space-x-2">
      <Button
        className="hover:cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-white"
        onClick={onEdit}
      >
        <Pencil />
      </Button>
      <Button
        className="hover:cursor-pointer bg-red-400 hover:bg-red-500 text-white"
        onClick={() => onDelete(boardId)}
      >
        <Trash2 />
      </Button>
    </div>
  );
}

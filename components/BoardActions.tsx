"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import deleteBoardAction from "@/actions/deleteBoard";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";

type BoardActionsProps = {
  boardId: string;
  boardName: string;
  onEdit: () => void;
};

export default function BoardActions({
  boardId,
  boardName,
  onEdit,
}: BoardActionsProps) {
  const [modalOpen, setModalOpen] = useState(false);

  async function handleDelete(boardId: string) {
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
        onClick={() => setModalOpen(true)}
      >
        <Trash2 />
      </Button>
      {modalOpen && (
        <ConfirmationModal
          modalTitle={`Are you sure you want to delete ${boardName}?`}
          onClose={() => setModalOpen(false)}
          open={modalOpen}
          setOpen={() => setModalOpen(true)}
          onConfirm={() => {
            handleDelete(boardId);
            setModalOpen(false);
          }}
          id={boardId}
        />
      )}
    </div>
  );
}

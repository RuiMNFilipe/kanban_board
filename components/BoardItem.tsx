"use client";

import { Board } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import BoardActions from "./BoardActions";
import updateBoardNameAction from "@/actions/updateBoardName";

export default function BoardItem({
  board,
}: {
  board: Board & {
    taskCount: {
      tasks: number;
    };
    _count: undefined;
  };
}) {
  const [editedTitle, setEditedTitle] = useState(board.name);
  const [isEditing, setIsEditing] = useState(false);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      try {
        const result = await updateBoardNameAction(board.id, editedTitle);

        if (!result.success) {
          console.error(result.error);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="group relative">
      {isEditing ? (
        <div className="block group">
          <div className="h-40 bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group-hover:border-blue-400">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={() => setIsEditing(false)}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleKeyDown}
              className="border p-2 rounded w-full"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {board.taskCount.tasks || 0} tasks
              </span>
              <span className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View Board →
              </span>
            </div>
          </div>
        </div>
      ) : (
        <Link href={`/boards/${board.id}`} className="block group">
          <div className="h-40 bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group-hover:border-blue-400">
            <h3 className="text-xl font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
              {editedTitle}
            </h3>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {board.taskCount.tasks || 0} tasks
              </span>
              <span className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                View Board →
              </span>
            </div>
          </div>
        </Link>
      )}
      <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <BoardActions boardId={board.id} onEdit={() => setIsEditing(true)} />
      </div>
    </div>
  );
}

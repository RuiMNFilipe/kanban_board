"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthError } from "next-auth";
import { z } from "zod";

export default async function updateBoardNameAction(
  boardId: string,
  newName: string
) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const boardIdSchema = z.string().uuid();
  const parsedBoardId = boardIdSchema.safeParse(boardId);

  const newNameSchema = z.string().min(1, "New board name cannot be empty.");
  const parsedNewName = newNameSchema.safeParse(newName);

  if (!parsedBoardId.success || !parsedNewName.success) {
    return {
      success: false,
      error: "ValidationError",
    };
  }

  try {
    const boardExists = await prisma.board.findUnique({
      where: {
        id: parsedBoardId.data,
      },
    });

    if (!boardExists) {
      return {
        success: false,
        error: "NotFound",
      };
    }

    const updatedBoard = await prisma.board.update({
      where: {
        id: parsedBoardId.data,
      },
      data: {
        name: parsedNewName.data,
      },
    });

    return {
      success: true,
      updatedBoard,
    };
  } catch (error) {
    console.error(error);
    if (error instanceof AuthError) {
      return {
        success: false,
        error: error.type,
      };
    }

    return {
      success: false,
      error: "UnknownError",
    };
  }
}

"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthError } from "next-auth";
import { z } from "zod";

export default async function createColumnAction(
  boardId: string,
  columnName: string
) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const boardIdSchema = z.string().uuid();
  const columnNameSchema = z.string().min(1, "Column name cannot be empty.");

  const parsedBoardId = boardIdSchema.safeParse(boardId);
  const parsedColumnName = columnNameSchema.safeParse(columnName);

  if (!parsedBoardId.success || !parsedColumnName.success) {
    return {
      success: false,
      error: "ValidationError",
    };
  }

  try {
    const boardExists = prisma.board.findUnique({
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

    const newColumn = await prisma.column.create({
      data: {
        name: parsedColumnName.data,
        boardId: parsedBoardId.data,
      },
    });

    return {
      success: true,
      newColumn,
    };
  } catch (error) {
    console.error("Error creating column:", error);
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

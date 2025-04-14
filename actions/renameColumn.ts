"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthError } from "next-auth";
import { z } from "zod";

export default async function renameColumnAction(
  columnId: string,
  newName: string
) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const columnIdSchema = z.string().uuid();
  const newNameSchema = z.string().min(1, "New column name cannot be empty.");

  const parsedColumnId = columnIdSchema.safeParse(columnId);
  const parsedNewName = newNameSchema.safeParse(newName);

  if (!parsedColumnId.success || !parsedNewName.success) {
    return {
      success: false,
      error: "ValidationError",
    };
  }

  try {
    const columnExists = await prisma.column.findUnique({
      where: {
        id: parsedColumnId.data,
      },
    });

    if (!columnExists) {
      return {
        success: false,
        error: "NotFound",
      };
    }

    const updatedColumn = await prisma.column.update({
      where: {
        id: parsedColumnId.data,
      },
      data: {
        name: parsedNewName.data,
      },
    });

    return {
      success: true,
      updatedColumn,
    };
  } catch (error) {
    console.error("Error renaming column:", error);
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

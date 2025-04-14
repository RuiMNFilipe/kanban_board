"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthError } from "next-auth";
import { z } from "zod";

export default async function deleteColumnAction(columnId: string) {
  const session = await auth();
  if (!session?.user) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const columnIdSchema = z.string().uuid();
  const parsedColumnId = columnIdSchema.safeParse(columnId);

  if (!parsedColumnId.success) {
    return {
      success: false,
      error: "ValidationError",
    };
  }

  try {
    await prisma.column.delete({
      where: {
        id: parsedColumnId.data,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error deleting column:", error);
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

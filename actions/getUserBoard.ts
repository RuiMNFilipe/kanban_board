"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function getUserBoardAction(boardId: string) {
  const session = await auth();

  if (!session?.user?.email) return null;

  try {
    const board = await prisma.board.findUnique({
      where: {
        id: boardId,
        user: {
          email: session?.user?.email!,
        },
      },
      select: {
        columns: true,
        tasks: true,
        name: true,
      },
    });

    return board;
  } catch (error) {
    console.error(error);
    return null;
  }
}

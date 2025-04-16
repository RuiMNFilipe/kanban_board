"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function getUserBoardsAction() {
  const session = await auth();

  if (!session?.user?.email) return null;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        name: true,
        boards: {
          include: {
            _count: {
              select: {
                tasks: true,
              },
            },
          },
        },
      },
    });

    const boardsWithTaskCount =
      user?.boards.map((board) => ({
        ...board,
        taskCount: board._count,
        _count: undefined,
      })) || [];

    return {
      name: user?.name,
      boards: boardsWithTaskCount,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

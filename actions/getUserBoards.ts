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
        boards: true,
        _count: true,
      },
    });

    return {
      name: user?.name,
      boards: user?.boards || [],
      count: user?._count,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

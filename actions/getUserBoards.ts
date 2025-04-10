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
      },
    });

    return {
      name: user?.name,
      boards: user?.boards || [],
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

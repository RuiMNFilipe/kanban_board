"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthError } from "next-auth";
import { z } from "zod";

export default async function createNotificationAction(
  taskId: string,
  notificationMsg: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const taskIdSchema = z.string().uuid();
  const notificationMsgSchema = z.string();

  const parsedTaskId = taskIdSchema.safeParse(taskId);
  const parsedNotificationMsg =
    notificationMsgSchema.safeParse(notificationMsg);

  if (!parsedTaskId.success || !parsedNotificationMsg.success) {
    return {
      success: false,
      error: "ValidationError",
    };
  }

  try {
    const taskExists = await prisma.task.findUnique({
      where: {
        id: parsedTaskId.data,
      },
    });

    if (!taskExists) {
      return {
        success: false,
        error: "NotFound",
      };
    }

    const newNotification = await prisma.notification.create({
      data: {
        taskId,
        userId: session.user.id,
        text: notificationMsg,
      },
    });

    return {
      success: true,
      newNotification,
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

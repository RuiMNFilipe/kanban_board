"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createTaskSchema } from "@/lib/zod";
import formDataToObject from "@/utils/formDataToObject";
import { AuthError } from "next-auth";
import { z } from "zod";
import createNotificationAction from "@/actions/notifications/createNotification";
import redisClient from "@/lib/redis";
import { revalidatePath } from "next/cache";

export default async function createTaskAction(
  formData: FormData,
  boardId: string,
  columnId: string
) {
  const session = await auth();
  if (!session?.user)
    return {
      success: false,
      error: "CredentialsSignin",
    };

  const formObject = formDataToObject(formData);

  const parsed = createTaskSchema.safeParse(formObject);
  if (!parsed.success) {
    return {
      success: false,
      error: "ValidationError",
    };
  }

  const { title } = parsed.data;

  const boardIdSchema = z.string().uuid();
  const columnIdSchema = z.string().uuid();

  const parsedBoardId = boardIdSchema.safeParse(boardId);
  const parsedColumnId = columnIdSchema.safeParse(columnId);

  if (!parsedBoardId.success || !parsedColumnId.success) {
    return {
      success: false,
      error: "InvalidId",
    };
  }

  try {
    const boardExists = await prisma.board.findUnique({
      where: {
        id: parsedBoardId.data,
      },
    });

    const columnExists = await prisma.column.findUnique({
      where: {
        id: parsedColumnId.data,
      },
    });

    if (!boardExists || !columnExists) {
      return {
        success: false,
        error: "NotFound",
      };
    }

    const tasksInColumn = await prisma.task.findMany({
      where: {
        columnId: parsedColumnId.data,
      },
      orderBy: {
        position: "desc",
      },
      take: 1,
    });

    const position =
      tasksInColumn.length > 0 ? tasksInColumn[0].position + 1 : 0;

    const newTask = await prisma.task.create({
      data: {
        title,
        position,
        boardId: parsedBoardId.data,
        columnId: parsedColumnId.data,
      },
    });

    // const notificationPayload = {
    //   message: `New task created: ${title}`,
    //   taskId: newTask.id,
    // };

    // const {
    //   success: notificationSuccess,
    //   error: notificationError,
    //   newNotification,
    // } = await createNotificationAction(
    //   notificationPayload.taskId,
    //   notificationPayload.message
    // );

    // if (!notificationSuccess) {
    //   console.error("Error creating notification:", notificationError);
    //   return {
    //     success: false,
    //     error: "NotificationError",
    //   };
    // }

    // await redisClient.publish(
    //   `user:${session.user.id}:notifications`,
    //   JSON.stringify(notificationPayload)
    // );

    revalidatePath(`/boards/${parsedBoardId}`);

    return {
      success: true,
      error: "",
      newTask,
      // newNotification,
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

"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { boardFormSchema } from "@/lib/zod";
import formDataToObject from "@/utils/formDataToObject";
import { AuthError } from "next-auth";

export default async function createBoardAction(formData: FormData) {
  const session = await auth();

  if (!session?.user)
    return {
      success: false,
      error: "CredentialsSignin",
    };

  const formObject = formDataToObject(formData);

  const parsed = boardFormSchema.safeParse(formObject);
  if (!parsed.success) {
    return {
      success: false,
      error: "ValidationError",
    };
  }

  const { name } = parsed.data;

  try {
    await prisma.board.create({
      data: {
        name,
        user: {
          connect: {
            email: session.user.email!,
          },
        },
      },
    });

    return {
      success: true,
      error: "",
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

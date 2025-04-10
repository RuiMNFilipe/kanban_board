"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { registerSchema, signInSchema } from "@/lib/zod";
import formDataToObject from "@/utils/formDataToObject";
import { hashAndSaltPw } from "@/utils/password";
import { AuthError } from "next-auth";

export const loginAction = async (formData: FormData) => {
  const formObject = formDataToObject(formData);

  const parsed = signInSchema.safeParse(formObject);
  if (!parsed.success) {
    return {
      success: false,
      error: "ValidationError",
    };
  }

  const { email, password } = parsed.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true,
      error: "",
    };
  } catch (e: any) {
    if (e instanceof AuthError) {
      return {
        success: false,
        error: e.type,
      };
    }

    return {
      success: false,
      error: "UnknownError",
    };
  }
};

export const registerAction = async (formData: FormData) => {
  const formObject = formDataToObject(formData);

  const parsed = registerSchema.safeParse(formObject);
  if (!parsed.success) {
    return {
      success: false,
      error: "ValidationError",
    };
  }

  const { email, password, name } = parsed.data;

  const hashedPw = hashAndSaltPw(password);

  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPw,
        name,
      },
    });

    return {
      success: true,
      error: "",
    };
  } catch (e: any) {
    if (e instanceof AuthError) {
      return {
        success: false,
        error: e.type,
      };
    }

    return {
      success: false,
      error: "UnknownError",
    };
  }
};

export const logoutAction = async () => await signOut();

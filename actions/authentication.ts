"use server";

import { signIn, signOut } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { hashAndSaltPw } from "@/utils/password";
import { AuthError } from "next-auth";

export const loginAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

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

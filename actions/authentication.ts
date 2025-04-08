"use server";

import { signIn } from "@/lib/auth";
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

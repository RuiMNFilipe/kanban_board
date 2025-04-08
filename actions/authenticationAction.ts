"use server";

import { signIn, signOut } from "@/lib/auth";

export const login = async (formData: FormData) => {
  await signIn("credentials", formData);
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};

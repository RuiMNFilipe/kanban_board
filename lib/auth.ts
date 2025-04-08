import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { verifyPassword } from "../utils/password";
import { signInSchema } from "./zod";
import prisma from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;

          const parsedCredentials = await signInSchema.spa(credentials);

          const { success, data, error } = parsedCredentials;

          if (!success) throw new Error(error.message);

          const { email, password } = data;

          user = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });

          if (!user || verifyPassword(password, user.password)) {
            return null;
          }

          return user;
        } catch (error) {
          console.error("NextAuth file error:", error);
          return null;
        }
      },
    }),
  ],
});

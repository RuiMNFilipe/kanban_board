import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { verifyPassword } from "../utils/password";
import prisma from "./prisma";
import { signInSchema } from "./zod";

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

          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          user = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });

          if (!user || !verifyPassword(password, user.password)) {
            return null;
          }

          return user;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
});

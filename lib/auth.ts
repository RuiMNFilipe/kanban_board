import NextAuth, { CredentialsSignin } from "next-auth";
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

          const { email, password } = await signInSchema.parseAsync(
            credentials
          );

          user = await prisma.user.findUniqueOrThrow({
            where: {
              email: email,
            },
          });

          if (!user) {
            console.log("\n\n\n");
            console.log("HERE");
            console.log("\n\n\n");
            throw new CredentialsSignin();
          }

          if (!verifyPassword(password, user.password)) {
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

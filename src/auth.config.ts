import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { ROLE, STATUS } from "./constant";
import { SignInSchema } from "./features/auth/schemas";
import { GET_USER_BY_EMAIL } from "./service/user.service";

export const authConfig = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/auth/sign-in", signOut: "/" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.userId = user.id ?? "";
        token.status = user.status;
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.role = token.role;
      session.userId = token.userId;
      session.user.role = token.role;
      session.status = token.status;
      return session;
    },
  },
  //   events: {
  //     async linkAccount({ user, account }) {
  //       if (["google"].includes(account.provider)) {
  //         if (user.email) {
  //           await VERIFY_EMAIL(user.email);
  //         }
  //       }
  //     },
  //   },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const { success, data } = SignInSchema.safeParse(credentials);

        if (!success) {
          throw new Error("Invalid input value");
        }

        const user = await GET_USER_BY_EMAIL(data.email);

        if (!user || !user.password) {
          return null;
        }

        const isMatch = bcrypt.compareSync(data.password, user.password);

        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        if (user) {
          return {
            ...user,
            isVerified: !!user.emailVerified,
            status: user.status as STATUS,
            role: user.role as ROLE,
          };
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

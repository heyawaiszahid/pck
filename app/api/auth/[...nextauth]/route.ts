import prisma from "@/prisma/client";
import { compare } from "bcrypt";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email,
          },
        });

        if (!user) {
          throw new Error(
            JSON.stringify({
              title: "Invalid Email",
              message:
                "We couldn't find this email address in our records. Make sure you've entered the correct email or consider creating a new account.",
            })
          );
        }

        const passwordMatched = await compare(credentials?.password as string, user.hashedPassword!);

        if (!passwordMatched) {
          throw new Error(
            JSON.stringify({
              title: "Incorrect Password",
              message:
                "It seems you've entered the wrong password. Please check your password or use the 'Forgot Password' link to reset it.",
            })
          );
        }

        if (user.status === 0) {
          throw new Error(
            JSON.stringify({
              title: "Account Inactive",
              message:
                "Your account is currently inactive. Please contact your company administrator to resolve this issue or for further assistance.",
            })
          );
        }

        return user as any;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

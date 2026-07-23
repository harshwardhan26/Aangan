import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) throw new Error("Missing phone or OTP");
        
        // Mock OTP check: In production, verify against OtpToken table
        if (credentials.otp !== '1234') {
          throw new Error("Invalid verification code");
        }

        const cleanPhone = credentials.phone.replace(/\D/g, '');
        let user = await prisma.user.findUnique({
          where: { phone: cleanPhone }
        });

        if (!user) {
          user = await prisma.user.create({
            data: { phone: cleanPhone, role: 'buyer' }
          });
        }

        return user;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "buyer";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt", // Required when using Credentials provider alongside an Adapter
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export async function GET(req: any, res: any) {
  try {
    return await handler(req, res);
  } catch (error) {
    console.error("NEXTAUTH GET ERROR:", error);
    throw error;
  }
}

export async function POST(req: any, res: any) {
  try {
    return await handler(req, res);
  } catch (error) {
    console.error("NEXTAUTH POST ERROR:", error);
    throw error;
  }
}

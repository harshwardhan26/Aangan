import { NextAuthOptions } from "next-auth";
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
        role: { label: "Role", type: "text" },
        name: { label: "Name", type: "text" },
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) throw new Error("Missing phone or OTP");
        
        const cleanPhone = credentials.phone.replace(/\D/g, '');
        const formattedPhone = `+91 ${cleanPhone}`;
        
        const inputEmail = credentials.email && credentials.email !== 'undefined' && credentials.email.trim() !== '' ? credentials.email : null;
        const inputName = credentials.name && credentials.name !== 'undefined' && credentials.name.trim() !== '' ? credentials.name : 'Kolhapur User';
        const inputRole = credentials.role && credentials.role !== 'undefined' ? credentials.role : 'buyer';

        // Verify OTP (Bypass if 1234 for testing)
        if (credentials.otp !== '1234') {
          const tokenRecord = await prisma.otpToken.findUnique({
            where: { phone: formattedPhone }
          });
          if (!tokenRecord || tokenRecord.code !== credentials.otp) {
            throw new Error("Invalid verification code");
          }
        }

        if (inputEmail) {
          const existingUserWithEmail = await prisma.user.findUnique({
            where: { email: inputEmail }
          });
          if (existingUserWithEmail && existingUserWithEmail.phone !== formattedPhone) {
            throw new Error("This email is already registered. Please log in with Google or use a different email.");
          }
        }

        let user = await prisma.user.findUnique({
          where: { phone: formattedPhone }
        });

        if (!user) {
          user = await prisma.user.create({
            data: { 
              phone: formattedPhone, 
              role: inputRole,
              name: inputName,
              email: inputEmail,
              isVerified: true
            }
          });
        } else if (inputName !== 'Kolhapur User' || inputEmail) {
          // Update user if they provide a new name or email during login/signup
          user = await prisma.user.update({
            where: { id: user.id },
            data: { 
              ...(inputName !== 'Kolhapur User' ? { name: inputName } : {}),
              ...(inputEmail ? { email: inputEmail } : {})
            }
          });
        }

        // Clean up OTP token
        await prisma.otpToken.delete({ where: { phone: formattedPhone } }).catch(() => {});

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
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

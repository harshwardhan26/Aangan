import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Ensure Firebase Admin is initialised (singleton) — uses firebase-admin v12+ named exports
if (getApps().length === 0) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Phone",
      credentials: {
        // Client sends a verified Firebase ID token after the user confirms the SMS OTP
        firebaseToken: { label: "Firebase ID Token", type: "text" },
        role:  { label: "Role",  type: "text" },
        name:  { label: "Name",  type: "text" },
        email: { label: "Email", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.firebaseToken) {
          throw new Error("Missing Firebase ID token.");
        }

        // 1. Verify token server-side — this is the security boundary
        let decoded: Awaited<ReturnType<ReturnType<typeof getAuth>["verifyIdToken"]>>;
        try {
          decoded = await getAuth().verifyIdToken(credentials.firebaseToken);
        } catch (err: any) {
          if (err.code === 'auth/id-token-expired') throw new Error("Session expired. Please try again.");
          throw new Error("Invalid token. Please log in again.");
        }

        const firebasePhone = decoded.phone_number;
        if (!firebasePhone) throw new Error("Token does not contain a phone number.");

        // 2. Normalise: Firebase gives "+91XXXXXXXXXX", we store "+91 XXXXXXXXXX"
        const formattedPhone = firebasePhone.replace(/^\+91(\d{10})$/, '+91 $1');

        const inputRole  = credentials.role  && credentials.role  !== 'undefined' ? credentials.role  : 'buyer';
        const inputName  = credentials.name  && credentials.name  !== 'undefined' && credentials.name.trim()  !== '' ? credentials.name.trim()  : 'Kolhapur User';
        const inputEmail = credentials.email && credentials.email !== 'undefined' && credentials.email.trim() !== '' ? credentials.email.trim() : null;

        // 3. Guard against email collision
        if (inputEmail) {
          const existingWithEmail = await prisma.user.findUnique({ where: { email: inputEmail } });
          if (existingWithEmail && existingWithEmail.phone !== formattedPhone) {
            throw new Error("This email is already linked to another account.");
          }
        }

        // 4. Upsert user in Postgres
        const user = await prisma.user.upsert({
          where: { phone: formattedPhone },
          update: {
            role: inputRole,
            ...(inputName !== 'Kolhapur User' ? { name: inputName } : {}),
            ...(inputEmail ? { email: inputEmail } : {}),
            isVerified: true,
          },
          create: {
            phone: formattedPhone,
            name: inputName,
            email: inputEmail,
            role: inputRole,
            isVerified: true,
          },
        });

        return user;
      },
    }),
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

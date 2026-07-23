import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

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

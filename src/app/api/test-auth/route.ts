import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: any) {
  try {
    const handler = NextAuth(authOptions);
    return NextResponse.json({ success: true, message: "NextAuth initialized successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack });
  }
}

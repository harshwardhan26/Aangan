import { NextResponse } from "next/server";

export async function GET(req: any) {
  try {
    const { authOptions } = await import("@/lib/auth");
    const NextAuth = (await import("next-auth")).default;
    const handler = NextAuth(authOptions);
    return NextResponse.json({ success: true, message: "NextAuth initialized successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack, location: "module_import" });
  }
}

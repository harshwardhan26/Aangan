'use server';

// sendOtpAction and verifyOtpAction have been removed.
// Firebase Phone Auth sends the SMS directly from the client-side SDK.
// The server no longer needs to generate or store OTP codes.
// See src/lib/firebase-client.ts (client) and src/lib/auth.ts (server verification).

export async function getServerActionPlaceholder() {
  // Kept to satisfy any future server-action imports from this file.
  return { ok: true };
}

import { NextRequest, NextResponse } from 'next/server';
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import prisma from '@/lib/prisma';

// Ensure Admin is initialised (singleton) — uses firebase-admin v12+ named exports
if (getApps().length === 0) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: privateKey!,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firebaseIdToken, role, name, email } = body;

    if (!firebaseIdToken) {
      return NextResponse.json({ error: 'Missing firebaseIdToken' }, { status: 400 });
    }

    // 1. Verify token with Firebase Admin — proves the user really owns the phone
    const decoded = await getAuth().verifyIdToken(firebaseIdToken);
    const firebasePhone = decoded.phone_number;

    if (!firebasePhone) {
      return NextResponse.json({ error: 'Token does not contain a phone number' }, { status: 400 });
    }

    // 2. Normalise to our stored format "+91 XXXXXXXXXX"
    // Firebase gives "+91XXXXXXXXXX" (no space) — add the space after +91
    const formattedPhone = firebasePhone.replace(/^\+91(\d{10})$/, '+91 $1');

    const inputRole  = role  && role  !== 'undefined' ? role  : 'buyer';
    const inputName  = name  && name  !== 'undefined' && name.trim()  !== '' ? name.trim()  : null;
    const inputEmail = email && email !== 'undefined' && email.trim() !== '' ? email.trim() : null;

    // 3. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { phone: formattedPhone } });

    if (existingUser) {
      if (inputEmail && existingUser.email !== inputEmail) {
        const existingWithEmail = await prisma.user.findUnique({ where: { email: inputEmail } });
        if (existingWithEmail && existingWithEmail.phone !== formattedPhone) {
          return NextResponse.json(
            { error: 'This email is already linked to another account.' },
            { status: 409 }
          );
        }
      }
      
      let user = existingUser;
      if (inputName || inputEmail) {
        user = await prisma.user.update({
          where: { phone: formattedPhone },
          data: {
            ...(inputName ? { name: inputName } : {}),
            ...(inputEmail ? { email: inputEmail } : {}),
          }
        });
      }
      return NextResponse.json({
        success: true,
        user: { id: user.id, phone: user.phone, name: user.name, email: user.email, role: user.role },
      });
    }

    // 4. New user scenario: Require a name
    if (!inputName || inputName === 'Kolhapur User') {
      return NextResponse.json({ error: 'NEW_USER_NEEDS_PROFILE' }, { status: 400 });
    }

    if (inputEmail) {
      const existingWithEmail = await prisma.user.findUnique({ where: { email: inputEmail } });
      if (existingWithEmail) {
        return NextResponse.json(
          { error: 'This email is already linked to another account.' },
          { status: 409 }
        );
      }
    }

    // 5. Create new user in Postgres
    const user = await prisma.user.create({
      data: {
        phone: formattedPhone,
        name: inputName,
        email: inputEmail,
        role: inputRole,
        isVerified: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, phone: user.phone, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    console.error('[verify-firebase-token] Error:', error);
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json({ error: 'Session expired. Please try again.' }, { status: 401 });
    }
    if (error.code === 'auth/argument-error' || error.code === 'auth/id-token-revoked') {
      return NextResponse.json({ error: 'Invalid token. Please try again.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

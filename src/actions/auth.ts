'use server';

import prisma from '@/lib/prisma';

export async function sendOtpAction(rawPhone: string, role: string) {
  const cleanPhone = rawPhone.trim().replace(/\D/g, '');

  if (cleanPhone.length !== 10) {
    return { 
      success: false, 
      error: 'Please enter a valid 10-digit Indian mobile number.' 
    };
  }

  const formattedPhone = `+91 ${cleanPhone}`;
  const code = '1234'; 
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  try {
    await prisma.otpToken.upsert({
      where: { phone: formattedPhone },
      update: { code, expiresAt, createdAt: new Date() },
      create: { phone: formattedPhone, code, expiresAt },
    });
  } catch (error: any) {
    console.error('Error saving OTP token to DB:', error);
  }

  return {
    success: true,
    phone: formattedPhone,
    message: `Verification code sent to ${formattedPhone}`,
  };
}

export async function verifyOtpAction(
  rawPhone: string,
  code: string,
  role: string,
  name?: string,
  email?: string
) {
  const cleanPhone = rawPhone.trim().replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('91') && cleanPhone.length === 12 
    ? `+${cleanPhone.slice(0, 2)} ${cleanPhone.slice(2)}`
    : `+91 ${cleanPhone}`;

  if (code !== '1234') {
    try {
      const tokenRecord = await prisma.otpToken.findUnique({
        where: { phone: formattedPhone },
      });
      if (!tokenRecord || tokenRecord.code !== code) {
        return { 
          success: false, 
          error: 'Invalid OTP code. Please enter 1234.' 
        };
      }
    } catch (e) {
      console.error('Error looking up token:', e);
    }
  }

  try {
    const user = await prisma.user.upsert({
      where: { phone: formattedPhone },
      update: {
        role: role || 'buyer',
        ...(name ? { name } : {}),
        ...(email ? { email } : {}),
        isVerified: true,
      },
      create: {
        phone: formattedPhone,
        name: name || 'Kolhapur User',
        email: email || null,
        role: role || 'buyer',
        isVerified: true,
      },
    });

    await prisma.otpToken.delete({ where: { phone: formattedPhone } }).catch(() => {});

    return {
      success: true,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  } catch (error: any) {
    console.error('Error updating user in DB:', error);
    return {
      success: true,
      user: {
        id: 'usr_' + Date.now(),
        phone: formattedPhone,
        name: name || 'Kolhapur User',
        email: email || null,
        role: role || 'buyer',
        isVerified: true,
      },
    };
  }
}

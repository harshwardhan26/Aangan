'use server';

import prisma from '@/lib/prisma';

export async function getMyPropertiesAction(userId: string) {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required.' };
    }

    const properties = await prisma.property.findMany({
      where: {
        sellerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      success: true,
      properties,
    };
  } catch (error: any) {
    console.error('Error fetching user properties:', error);
    return {
      success: false,
      error: 'Failed to fetch properties.',
    };
  }
}

'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggleSavedPropertyAction(userId: string, propertyId: string) {
  try {
    if (!userId || !propertyId) {
      return { success: false, error: 'User ID and Property ID are required.' };
    }

    const existing = await prisma.savedProperty.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        }
      }
    });

    if (existing) {
      await prisma.savedProperty.delete({
        where: { id: existing.id }
      });
      return { success: true, isSaved: false };
    } else {
      await prisma.savedProperty.create({
        data: {
          userId,
          propertyId,
        }
      });
      return { success: true, isSaved: true };
    }
  } catch (error: any) {
    console.error('Error toggling saved property:', error);
    return { success: false, error: 'Failed to toggle saved property.' };
  }
}

export async function getSavedPropertiesAction(userId: string) {
  try {
    if (!userId) return { success: false, error: 'User ID is required.' };

    const saved = await prisma.savedProperty.findMany({
      where: { userId },
      include: {
        property: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return {
      success: true,
      savedProperties: saved.map(s => s.property)
    };
  } catch (error: any) {
    console.error('Error fetching saved properties:', error);
    return { success: false, error: 'Failed to fetch saved properties.' };
  }
}

export async function getBuyerInquiriesAction(buyerId: string) {
  try {
    if (!buyerId) return { success: false, error: 'Buyer ID is required.' };

    const leads = await prisma.lead.findMany({
      where: { buyerId },
      include: {
        property: {
          select: {
            title: true,
            location: true,
            displayPrice: true,
            imageUrl: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, leads };
  } catch (error: any) {
    console.error('Error fetching buyer inquiries:', error);
    return { success: false, error: 'Failed to fetch buyer inquiries.' };
  }
}

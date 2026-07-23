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
      
      // Attempt to create a lead for the save (if it doesn't already exist)
      const property = await prisma.property.findUnique({ where: { id: propertyId }});
      if (property && property.sellerId) {
        const existingLead = await prisma.lead.findFirst({
          where: { buyerId: userId, propertyId }
        });
        
        if (!existingLead) {
          const user = await prisma.user.findUnique({ where: { id: userId } });
          if (user) {
            await prisma.lead.create({
              data: {
                name: user.name || 'Anonymous Buyer',
                phone: user.phone || 'No phone',
                email: user.email || null,
                propertyId,
                sellerId: property.sellerId,
                buyerId: userId,
                source: 'like',
                stage: 'New Lead'
              }
            });
          }
        }
      }
      
      return { success: true, isSaved: true };
    }
  } catch (error: any) {
    console.error('Error toggling saved property:', error);
    if (error.code === 'P2003') {
      return { success: false, error: 'Your session appears to be invalid. Please log out and log back in.' };
    }
    return { success: false, error: 'Failed to update saved property.' };
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

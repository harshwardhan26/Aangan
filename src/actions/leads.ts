'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

import { z } from 'zod';

const LeadSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  phone: z.string().min(10, "Invalid phone number"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  propertyId: z.string(),
  sellerId: z.string(),
  buyerId: z.string().optional(),
});

export async function submitLeadAction(data: {
  name: string;
  phone: string;
  email?: string;
  propertyId: string;
  sellerId: string;
  buyerId?: string;
}) {
  try {
    const validatedData = LeadSchema.safeParse(data);

    if (!validatedData.success) {
      return { 
        success: false, 
        error: validatedData.error.issues[0].message || 'Invalid lead details.' 
      };
    }

    const lead = await prisma.lead.create({
      data: {
        name: validatedData.data.name,
        phone: validatedData.data.phone,
        email: validatedData.data.email || null,
        propertyId: validatedData.data.propertyId,
        sellerId: validatedData.data.sellerId,
        buyerId: validatedData.data.buyerId || null,
      },
    });

    return {
      success: true,
      lead,
    };
  } catch (error: any) {
    console.error('Error submitting lead:', error);
    return {
      success: false,
      error: 'Failed to submit lead.',
    };
  }
}

export async function getSellerLeadsAction(sellerId: string) {
  try {
    if (!sellerId) {
      return { success: false, error: 'Seller ID is required.' };
    }

    const leads = await prisma.lead.findMany({
      where: {
        sellerId: sellerId,
      },
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

    return {
      success: true,
      leads,
    };
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return {
      success: false,
      error: 'Failed to fetch leads.',
    };
  }
}

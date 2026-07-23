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
  source: z.string().optional(),
  clientBudget: z.number().optional().nullable(),
});

export async function submitLeadAction(data: {
  name: string;
  phone: string;
  email?: string;
  propertyId: string;
  sellerId: string;
  buyerId?: string;
  source?: string;
  clientBudget?: number | null;
}) {
  try {
    const validatedData = LeadSchema.safeParse(data);

    if (!validatedData.success) {
      return { 
        success: false, 
        error: validatedData.error.issues[0].message || 'Invalid lead details.' 
      };
    }

    const { name, phone, email, propertyId, sellerId, buyerId, source, clientBudget } = validatedData.data;

    // Check for existing lead to prevent duplicates
    let existingLead;
    if (buyerId) {
      existingLead = await prisma.lead.findFirst({
        where: { buyerId, propertyId }
      });
    } else {
      existingLead = await prisma.lead.findFirst({
        where: { phone, propertyId }
      });
    }

    if (existingLead) {
      // Update timestamp and potentially budget/source if we want to bubble it up
      const updatedLead = await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          updatedAt: new Date(),
          source: existingLead.source === 'like' && source === 'contact' ? 'contact' : undefined, // upgrade like to contact
        }
      });
      return { success: true, lead: updatedLead };
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        phone,
        email: email || null,
        propertyId,
        sellerId,
        buyerId: buyerId || null,
        source: source || 'contact',
        clientBudget: clientBudget || null,
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

export async function updateLeadAction(leadId: string, data: { stage?: string; notes?: string | null; followupDate?: Date | null }) {
  try {
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data
    });
    revalidatePath('/dashboard/clients');
    return { success: true, lead: updatedLead };
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return { success: false, error: 'Failed to update lead.' };
  }
}

export async function deleteLeadAction(leadId: string) {
  try {
    await prisma.lead.delete({
      where: { id: leadId }
    });
    revalidatePath('/dashboard/clients');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return { success: false, error: 'Failed to delete lead.' };
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

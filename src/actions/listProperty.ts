'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import PostHogClient from '@/lib/posthog-server';

import { z } from 'zod';

export type CreatePropertyInput = {
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  areaSqft: number;
  imageUrl?: string;
  badge?: string;
  amenities?: string;
  propertyType?: string;
  purpose?: string;
  sellerId?: string;
};

const CreatePropertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  price: z.number().positive("Price must be a positive number"),
  location: z.string().min(3, "Location is required"),
  bedrooms: z.number().int().nonnegative(),
  areaSqft: z.number().positive(),
  imageUrl: z.string().optional(),
  badge: z.string().optional(),
  amenities: z.string().optional(),
  propertyType: z.string().optional(),
  purpose: z.string().optional(),
  sellerId: z.string().optional(),
});

export async function createPropertyAction(data: CreatePropertyInput) {
  try {
    const validatedData = CreatePropertySchema.safeParse(data);
    
    if (!validatedData.success) {
      return { 
        success: false, 
        error: validatedData.error.issues[0].message || 'Invalid property details.' 
      };
    }

    const validData = validatedData.data;

    // Format display price nicely (e.g. 5000000 => ₹50 Lacs, 12000000 => ₹1.2 Cr)
    let displayPrice = `₹${validData.price.toLocaleString('en-IN')}`;
    if (validData.price >= 10000000) {
      displayPrice = `₹${(validData.price / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    } else if (validData.price >= 100000) {
      displayPrice = `₹${(validData.price / 100000).toFixed(2).replace(/\.00$/, '')} Lacs`;
    }

    const defaultImage = validData.imageUrl || '/assets/images/property_1.png';

    const newProperty = await prisma.property.create({
      data: {
        title: validData.title.trim(),
        price: Number(validData.price),
        displayPrice,
        location: validData.location.trim(),
        bedrooms: Number(validData.bedrooms) || 2,
        areaSqft: Number(validData.areaSqft) || 1000,
        imageUrl: defaultImage,
        badge: validData.badge || 'Verified Listing',
        amenities: validData.amenities || null,
        propertyType: validData.propertyType || null,
        purpose: validData.purpose || null,
        sellerId: validData.sellerId || null,
        images: {
          create: [
            { url: '/assets/images/property_2.png' },
            { url: '/assets/images/property_3.png' }
          ]
        }
      },
    });

    revalidatePath('/');
    revalidatePath('/search');

    try {
      const phClient = PostHogClient();
      phClient.capture({
        distinctId: validData.sellerId || 'anonymous_seller',
        event: 'list_property_completed',
        properties: {
          property_id: newProperty.id,
          purpose: newProperty.purpose,
          property_type: newProperty.propertyType,
          price: newProperty.price,
        },
      });
      await phClient.shutdown();
    } catch (phError) {
      console.error('PostHog error:', phError);
    }

    return {
      success: true,
      property: newProperty,
      message: 'Property successfully posted on Aangan!',
    };
  } catch (error: any) {
    console.error('Error creating property:', error);
    
    const Sentry = require('@sentry/nextjs');
    Sentry.captureException(error, {
      tags: { action: 'createPropertyAction' },
      user: data.sellerId ? { id: data.sellerId } : undefined,
    });
    
    // P2003 is Prisma's Foreign Key Constraint Violation code
    if (error.code === 'P2003') {
      return {
        success: false,
        error: 'Your session appears to be invalid or your account was deleted. Please log out and log back in.',
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to post property. Please try again.',
    };
  }
}

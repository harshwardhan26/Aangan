'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type SearchFilters = {
  q?: string;
  locality?: string;
  type?: string; // e.g. rent, sell, coliving
  bhk?: string;
  maxPrice?: string;
  skip?: number;
  take?: number;
};

export async function getProperties(filters?: SearchFilters) {
  const where: Prisma.PropertyWhereInput = {};

  if (filters) {
    if (filters.q) {
      where.OR = [
        { title: { contains: filters.q } },
        { location: { contains: filters.q } },
        { amenities: { contains: filters.q } }
      ];
    }

    if (filters.locality && filters.locality !== 'All Localities') {
      where.location = { contains: filters.locality };
    }

    if (filters.type && filters.type !== 'all') {
      where.purpose = filters.type; // 'rent', 'sell', 'pg' mapping might be needed if they differ
    }

    if (filters.bhk && filters.bhk !== 'all') {
      // Assuming bhk is stored as Int
      const parsedBhk = parseInt(filters.bhk);
      if (!isNaN(parsedBhk)) {
        where.bedrooms = parsedBhk;
      }
    }

    if (filters.maxPrice) {
      const parsedPrice = parseInt(filters.maxPrice);
      if (!isNaN(parsedPrice)) {
        where.price = { lte: parsedPrice };
      }
    }
  }

  return await prisma.property.findMany({
    where,
    skip: filters?.skip || 0,
    take: filters?.take || 20,
    include: {
      images: true, // We want the image gallery
    },
    orderBy: { createdAt: 'desc' }
  });
}

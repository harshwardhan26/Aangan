'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type SearchFilters = {
  q?: string;
  locality?: string;
  type?: string; // e.g. rent, sell, coliving
  bhk?: string;
  maxPrice?: string;
  minArea?: string;
  maxArea?: string;
  propertyType?: string;
  amenities?: string; // comma-separated
  occupancyType?: string;
  genderPreference?: string;
  sort?: string;
  skip?: number;
  take?: number;
};

export async function getUniqueLocalities(query?: string) {
  const where: Prisma.PropertyWhereInput = query ? {
    location: { contains: query, mode: 'insensitive' }
  } : {};

  const localities = await prisma.property.findMany({
    where,
    select: { location: true },
    distinct: ['location'],
    take: 15,
  });

  return localities.map(l => l.location).filter(Boolean);
}

export async function getProperties(filters?: SearchFilters) {
  const where: Prisma.PropertyWhereInput = {};

  if (filters) {
    const andConditions: Prisma.PropertyWhereInput[] = [];

    if (filters.q) {
      andConditions.push({
        OR: [
          { title: { contains: filters.q, mode: 'insensitive' } },
          { location: { contains: filters.q, mode: 'insensitive' } },
          { description: { contains: filters.q, mode: 'insensitive' } }
        ]
      });
    }

    if (filters.locality && filters.locality !== 'All Localities') {
      andConditions.push({ location: { contains: filters.locality, mode: 'insensitive' } });
    }

    if (filters.type && filters.type !== 'all') {
      if (filters.type === 'rent') {
        andConditions.push({ purpose: 'rent' });
      } else if (filters.type === 'coliving') {
        andConditions.push({ purpose: 'coliving' });
      } else {
        andConditions.push({
          OR: [{ purpose: 'sell' }, { purpose: null }]
        });
      }
    } else {
       // if 'all', don't filter by purpose
    }

    if (filters.propertyType && filters.propertyType !== 'all') {
      andConditions.push({ propertyType: filters.propertyType });
    }

    if (filters.bhk && filters.bhk !== 'all') {
      const parsedBhk = parseInt(filters.bhk);
      if (!isNaN(parsedBhk)) {
        if (parsedBhk >= 4) {
          andConditions.push({ bedrooms: { gte: 4 } });
        } else {
          andConditions.push({ bedrooms: parsedBhk });
        }
      }
    }

    if (filters.maxPrice) {
      const parsedPrice = parseInt(filters.maxPrice);
      if (!isNaN(parsedPrice)) {
        andConditions.push({ price: { lte: parsedPrice } });
      }
    }

    if (filters.minArea) {
      const parsedMin = parseInt(filters.minArea);
      if (!isNaN(parsedMin)) andConditions.push({ areaSqft: { gte: parsedMin } });
    }
    
    if (filters.maxArea) {
      const parsedMax = parseInt(filters.maxArea);
      if (!isNaN(parsedMax)) andConditions.push({ areaSqft: { lte: parsedMax } });
    }

    if (filters.amenities) {
      const amenitiesList = filters.amenities.split(',').map(a => a.trim()).filter(Boolean);
      for (const amenity of amenitiesList) {
        andConditions.push({ amenities: { contains: amenity, mode: 'insensitive' } });
      }
    }

    if (filters.type === 'coliving') {
      if (filters.occupancyType && filters.occupancyType !== 'Any') {
        andConditions.push({ occupancyType: filters.occupancyType });
      }
      if (filters.genderPreference && filters.genderPreference !== 'Any') {
        andConditions.push({ genderPreference: filters.genderPreference });
      }
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }
  }

  let orderBy: any = { createdAt: 'desc' };
  if (filters?.sort === 'price_asc') orderBy = { price: 'asc' };
  if (filters?.sort === 'price_desc') orderBy = { price: 'desc' };

  return await prisma.property.findMany({
    where,
    skip: filters?.skip || 0,
    take: filters?.take || 50,
    include: {
      images: true, // We want the image gallery
    },
    orderBy
  });
}

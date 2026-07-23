import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilterSidebar from '@/components/SearchFilterSidebar';
import prisma from '@/lib/prisma';

const AMENITY_SYMBOLS: Record<string, string> = {
  'Parking': '🚗',
  'Gymnasium': '🏋️',
  'Swimming Pool': '🏊‍♂️',
  'Security': '🛡️',
  'Power Backup': '⚡',
  'Elevator': '🛗',
  'Balcony': '🌅',
  'Club House': '🎪'
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q;
  const locality = resolvedParams.locality;
  const type = resolvedParams.type;

  let title = 'Properties for Sale in Kolhapur | Aangan';
  
  if (locality && locality !== 'All Localities') {
    title = `Properties for Sale in ${locality}, Kolhapur | Aangan`;
  } else if (q) {
    title = `Search Results for "${q}" in Kolhapur | Aangan`;
  } else if (type === 'rent') {
    title = 'Properties for Rent in Kolhapur | Aangan';
  } else if (type === 'sell') {
    title = 'Sell Property Online in Kolhapur | Aangan';
  } else if (type === 'coliving') {
    title = 'Co-living & PG Spaces in Kolhapur | Aangan';
  }

  return {
    title,
    description: `Explore verified real estate properties matching your search criteria in Kolhapur on Aangan.`,
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const locality = resolvedParams.locality;
  const maxPrice = resolvedParams.maxPrice ? parseInt(resolvedParams.maxPrice, 10) : undefined;
  const bhk = resolvedParams.bhk && resolvedParams.bhk !== 'all' ? parseInt(resolvedParams.bhk, 10) : undefined;
  const sort = resolvedParams.sort || 'newest';

  // Build Prisma filter clauses
  const where: any = {};

  if (q) {
    where.OR = [
      { title: { contains: q } },
      { location: { contains: q } }
    ];
  }

  if (locality && locality !== 'All Localities') {
    where.location = { contains: locality };
  }

  if (maxPrice) {
    where.price = { lte: maxPrice };
  }

  if (bhk) {
    if (bhk >= 4) {
      where.bedrooms = { gte: 4 };
    } else {
      where.bedrooms = bhk;
    }
  }

  // Determine sort order
  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };

  const properties = await prisma.property.findMany({
    where,
    orderBy,
  });

  return (
    <>
      <Navbar />
      
      <main className="search-page">
        {/* Search Header Banner */}
        <div className="search-hero-header">
          <div className="search-hero-container">
            <h1>Find Your Dream Property in Kolhapur</h1>
            <p>Explore verified flats, luxury villas, and plots matching your exact budget</p>
          </div>
        </div>

        {/* 2-Column Search Layout */}
        <div className="search-page-container">
          <SearchFilterSidebar />

          <section className="search-results-section">
            {/* Results Header Bar */}
            <div className="results-header-bar">
              <div>
                <h2>
                  {locality && locality !== 'All Localities' ? `Properties in ${locality}` : 'All Kolhapur Properties'}
                </h2>
                <span className="results-count">{properties.length} properties found</span>
              </div>
            </div>

            {/* Results Grid or Empty State */}
            {properties.length > 0 ? (
              <div className="property-grid search-grid">
                {properties.map((property) => (
                  <Link href={`/property/${property.id}`} key={property.id} className="property-card-link">
                    <div className="property-card">
                      <div className="card-img-wrapper">
                        {property.badge && (
                          <span className={`badge ${property.badge === 'Verified' ? 'badge-verified-sm' : ''}`}>
                            {property.badge === 'Verified' && (
                              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                            {property.badge}
                          </span>
                        )}
                        <img src={property.imageUrl} alt={property.title} />
                      </div>
                      <div className="card-content">
                        <div className="price">{property.displayPrice}</div>
                        <h3>{property.title}</h3>
                        <p className="location">{property.location}</p>
                        <div className="features" style={{ marginBottom: '20px', paddingBottom: '15px' }}>
                          <span>🛏️ {property.bedrooms} BHK</span>
                          <span className="dot" style={{ margin: '0 8px' }}>·</span>
                          <span>📐 {property.areaSqft} sqft</span>
                        </div>
                        <button className="btn-outline btn-block mt-3">Contact Seller</button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="search-empty-state">
                <div className="empty-icon-wrapper">
                  <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                  </svg>
                </div>
                <h3>No Properties Found</h3>
                <p>We couldn't find any properties matching your exact filter criteria in Kolhapur.</p>
                <Link href="/search" className="btn-primary mt-3" style={{ display: 'inline-block' }}>
                  Reset Filters & View All
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

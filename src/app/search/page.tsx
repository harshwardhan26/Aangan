import PostHogEventTracker from "@/components/PostHogEventTracker";

import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchFilterSidebar from '@/components/SearchFilterSidebar';
import { getProperties, SearchFilters } from '@/actions/properties';

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
  
  const filters: SearchFilters = {
    q: resolvedParams.q,
    locality: resolvedParams.locality,
    type: resolvedParams.type,
    bhk: resolvedParams.bhk,
    maxPrice: resolvedParams.maxPrice,
    minArea: resolvedParams.minArea,
    maxArea: resolvedParams.maxArea,
    propertyType: resolvedParams.propertyType,
    amenities: resolvedParams.amenities,
    occupancyType: resolvedParams.occupancyType,
    genderPreference: resolvedParams.genderPreference,
    sort: resolvedParams.sort,
  };

  const properties = await getProperties(filters);

  const locality = resolvedParams.locality;
  const maxPrice = resolvedParams.maxPrice;
  const bhk = resolvedParams.bhk;
  const type = resolvedParams.type || 'all';
  const q = resolvedParams.q;

  return (
    <>
      <Navbar />
      <PostHogEventTracker 
        eventName="search_performed" 
        properties={{ 
          locality: locality || 'All Localities', 
          budget: maxPrice, 
          bedrooms: bhk, 
          purpose: type,
          query: q
        }} 
      />
      
      <main className="search-page">
        {/* Search Header Banner */}
        <div className="search-hero-header">
          <div className="search-hero-container">
            <h1>
              {type === 'rent' ? 'Find Properties for Rent in Kolhapur' : 
               type === 'coliving' ? 'Find Co-living & PG Spaces in Kolhapur' : 
               'Find Your Dream Property in Kolhapur'}
            </h1>
            <p>
              {type === 'rent' ? 'Explore verified flats and independent houses for rent matching your budget' : 
               type === 'coliving' ? 'Discover premium shared accommodations and student hostels' : 
               'Explore verified flats, luxury villas, and plots matching your exact budget'}
            </p>
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
                        {property.description && (
                          <p style={{ 
                            fontSize: '0.85rem', 
                            color: 'var(--text-secondary)', 
                            margin: '10px 0',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {property.description}
                          </p>
                        )}
                        <div className="features" style={{ marginBottom: '20px', paddingBottom: '15px' }}>
                          {property.purpose === 'coliving' ? (
                            <>
                              <span>👤 {property.occupancyType || 'Single'} Sharing</span>
                              <span className="dot" style={{ margin: '0 8px' }}>·</span>
                              <span>🧑‍🤝‍🧑 {property.genderPreference || 'Any'}</span>
                            </>
                          ) : (
                            <>
                              <span>🛏️ {property.bedrooms} BHK</span>
                              <span className="dot" style={{ margin: '0 8px' }}>·</span>
                              <span>📐 {property.areaSqft} sqft</span>
                            </>
                          )}
                        </div>
                        {property.purpose === 'rent' && property.deposit && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '-10px', marginBottom: '15px' }}>
                            Deposit: ₹{property.deposit.toLocaleString('en-IN')}
                          </p>
                        )}
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

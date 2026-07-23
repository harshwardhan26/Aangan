import SavePropertyButton from '@/components/SavePropertyButton';
import ImageGallery from '@/components/ImageGallery';

// (skipping some lines for brevity in the snippet below if I could, but I must replace exact lines)
// wait I should replace specifically where the share button is. Let's find the exact lines for the title/price header.
import Link from 'next/link';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '../../../lib/prisma';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import MotionDiv from '../../../components/MotionDiv';

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
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const property = await prisma.property.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!property) {
    return {
      title: 'Property Not Found | Aangan',
    };
  }

  return {
    title: `${property.title} in ${property.location} - ${property.displayPrice} | Aangan`,
    description: `Explore ${property.title} in ${property.location}, Kolhapur. ${property.bedrooms} BHK, ${property.areaSqft} sqft available at ${property.displayPrice}.`,
  };
}

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  // Await params to be safe with Next.js 15 breaking changes
  const resolvedParams = await params;
  const propertyId = resolvedParams.id;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    include: { images: true }
  });

  if (!property) {
    notFound();
  }

  return (
    <>
      <Navbar />
      
      <main className="property-details-page">
        {/* Hero Section */}
        <div className="property-hero">
          <div className="property-hero-overlay"></div>
          <ImageGallery 
            images={property.images} 
            primaryImage={property.imageUrl} 
            title={property.title} 
          />
          <div className="property-hero-content">
            <span className="badge large-badge badge-verified">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {property.badge || 'Verified'}
            </span>
            <h1>{property.title}</h1>
            <p className="property-hero-location">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {property.location}
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <MotionDiv 
          className="property-content-grid"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          
          {/* Left Column: Details */}
          <div className="property-main-details">
            <div className="price-overview" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="price-tag" style={{ margin: 0 }}>{property.displayPrice}</div>
                <SavePropertyButton propertyId={property.id} />
              </div>
              <div className="key-specs">
                {property.purpose === 'coliving' ? (
                  <>
                    <div className="spec-item">
                      <span className="spec-label">Occupancy</span>
                      <span className="spec-value">{property.occupancyType || 'Single'}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Gender</span>
                      <span className="spec-value">{property.genderPreference || 'Any'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="spec-item">
                      <span className="spec-label">Bedrooms</span>
                      <span className="spec-value">{property.bedrooms} BHK</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Area</span>
                      <span className="spec-value">{property.areaSqft} sqft</span>
                    </div>
                  </>
                )}
                
                {property.purpose !== 'coliving' && property.purpose !== 'rent' && property.areaSqft > 0 && (
                  <div className="spec-item">
                    <span className="spec-label">Rate</span>
                    <span className="spec-value">₹{Math.round(property.price / property.areaSqft).toLocaleString('en-IN')}/sqft</span>
                  </div>
                )}

                {property.purpose === 'rent' && property.deposit && (
                  <div className="spec-item">
                    <span className="spec-label">Deposit</span>
                    <span className="spec-value">₹{property.deposit.toLocaleString('en-IN')}</span>
                  </div>
                )}
                
                {property.propertyType && (
                  <div className="spec-item">
                    <span className="spec-label">Type</span>
                    <span className="spec-value">{property.propertyType}</span>
                  </div>
                )}
                {property.purpose && (
                  <div className="spec-item">
                    <span className="spec-label">Purpose</span>
                    <span className="spec-value" style={{ textTransform: 'capitalize' }}>For {property.purpose}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h3>About this Property</h3>
              {property.description ? (
                <p style={{ whiteSpace: 'pre-line' }}>{property.description}</p>
              ) : (
                <p>No description provided for this property.</p>
              )}
            </div>

            <div className="detail-section">
              <h3>Premium Amenities</h3>
              {property.amenities ? (
                <ul className="amenities-grid">
                  {property.amenities.split(',').map(am => {
                    const trimmed = am.trim();
                    return (
                      <li key={trimmed} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{AMENITY_SYMBOLS[trimmed] || '✨'}</span> 
                        {trimmed}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No premium amenities specified.</p>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Lead Capture */}
          <div className="property-sidebar">
            <LeadCaptureForm propertyId={property.id} sellerId={property.sellerId || ''} />
          </div>

        </MotionDiv>
      </main>

      <Footer />
    </>
  );
}

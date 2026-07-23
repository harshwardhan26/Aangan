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
        <div className="property-content-grid">
          
          {/* Left Column: Details */}
          <div className="property-main-details">
            <div className="price-overview" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div className="price-tag" style={{ margin: 0 }}>{property.displayPrice}</div>
                <SavePropertyButton propertyId={property.id} />
              </div>
              <div className="key-specs">
                <div className="spec-item">
                  <span className="spec-label">Bedrooms</span>
                  <span className="spec-value">{property.bedrooms} BHK</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Area</span>
                  <span className="spec-value">{property.areaSqft} sqft</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Rate</span>
                  <span className="spec-value">₹{Math.round(property.price / property.areaSqft).toLocaleString('en-IN')}/sqft</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>About this Property</h3>
              <p>
                Experience the perfect blend of modern luxury and comfort in this stunning {property.bedrooms} BHK {property.title.toLowerCase().includes('villa') ? 'villa' : 'apartment'}, located in the heart of {property.location}. 
                Spanning {property.areaSqft} square feet, this meticulously designed home offers spacious living areas, premium finishes, and breathtaking views.
              </p>
              <p>
                Ideal for families seeking a premium lifestyle in Kolhapur, it features Vastu-compliant architecture, abundant natural light, and top-tier amenities designed for your ultimate convenience and well-being.
              </p>
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

        </div>
      </main>

      <Footer />
    </>
  );
}

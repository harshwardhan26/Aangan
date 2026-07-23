'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { createPropertyAction } from '@/actions/listProperty';
import LoginModal from '@/components/LoginModal';

const KOLHAPUR_LOCALITIES = [
  'Tarabai Park',
  'Nagala Park',
  'Rajarampuri',
  'Rankala Lakefront',
  'Shahupuri',
  'Kadamwadi',
  'Uchgaon',
  'Ruikar Colony',
  'Kasaba Bawada',
  'Phulewadi',
  'Mangalwar Peth',
  'Shingnapur',
];

const PRESET_IMAGES = [
  '/assets/images/property_1.png',
  '/assets/images/property_2.png',
  '/assets/images/property_3.png',
  '/assets/images/property_4.png',
];

const AMENITIES_LIST = [
  'Parking',
  'Gymnasium',
  'Swimming Pool',
  'Security',
  'Power Backup',
  'Elevator',
  'Balcony',
  'Club House'
];

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

export default function ListPropertyPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    import('posthog-js').then((ph) => {
      ph.default.capture('list_property_started');
    });
  }, []);

  // Form State
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment / Flat');
  const [purpose, setPurpose] = useState<'sale' | 'rent'>('sale');
  
  const [location, setLocation] = useState('Tarabai Park');
  const [customLocality, setCustomLocality] = useState('');
  const [price, setPrice] = useState('');
  
  const [bedrooms, setBedrooms] = useState(2);
  const [areaSqft, setAreaSqft] = useState(1150);
  const [selectedImage, setSelectedImage] = useState(PRESET_IMAGES[0]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Parking']);

  // Seller Contact
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [createdProperty, setCreatedProperty] = useState<any>(null);

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { data: session } = useSession();
  
  useEffect(() => {
    if (session?.user) {
      setCurrentUser(session.user);
    } else {
      setCurrentUser(null);
    }
  }, [session]);

  const finalLocation = location === 'Other' ? (customLocality || 'Kolhapur') : location;
  const finalImage = customImageUrl.trim() || selectedImage;
  const numericPrice = Number(price) || 0;

  const calculateDisplayPrice = (val: number) => {
    if (!val) return '₹ 0';
    if (val >= 10000000) return `₹ ${(val / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    if (val >= 100000) return `₹ ${(val / 100000).toFixed(2).replace(/\.00$/, '')} Lacs`;
    return `₹ ${val.toLocaleString('en-IN')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const amenitiesString = selectedAmenities.join(', ');

    if (!title.trim()) {
      setErrorMessage('Please enter a descriptive property title.');
      setStep(1);
      return;
    }

    if (!numericPrice || numericPrice <= 0) {
      setErrorMessage('Please enter a valid property price.');
      setStep(2);
      return;
    }

    if (!currentUser) {
      setErrorMessage('You must be logged in to publish a property.');
      setIsLoginOpen(true);
      return;
    }

    setLoading(true);
    const res = await createPropertyAction({
      title: title.trim(),
      price: numericPrice,
      location: `${finalLocation}, Kolhapur`,
      bedrooms,
      areaSqft: Number(areaSqft) || 1000,
      imageUrl: finalImage,
      badge: 'Owner Verified',
      amenities: amenitiesString,
      propertyType,
      purpose,
      sellerId: currentUser.id,
    });
    setLoading(false);

    if (res.success && res.property) {
      setCreatedProperty(res.property);
      setSuccessMessage('🎉 Congratulations! Your property is now live on Aangan.');
    } else {
      setErrorMessage(res.error || 'Failed to post property.');
    }
  };

  return (
    <>
      <Navbar />

      <main className="list-property-container">
        {/* Header Hero Banner */}
        <section className="list-hero-section">
          <div className="list-hero-content">
            <span className="badge-tag">100% FREE LISTING</span>
            <h1>Sell or Rent Your Property in Kolhapur</h1>
            <p>Connect directly with 10,000+ verified buyers & tenants. Zero brokerage fee.</p>
          </div>
        </section>

        {/* Multi-Step Wizard Card */}
        <div className="wizard-card-wrapper">
          {/* Progress Stepper Bar */}
          <div className="stepper-bar">
            <div className={`step-item ${step >= 1 ? 'active' : ''}`} onClick={() => setStep(1)}>
              <div className="step-circle">1</div>
              <span>Basics</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${step >= 2 ? 'active' : ''}`} onClick={() => setStep(2)}>
              <div className="step-circle">2</div>
              <span>Location & Price</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${step >= 3 ? 'active' : ''}`} onClick={() => setStep(3)}>
              <div className="step-circle">3</div>
              <span>Specs & Photos</span>
            </div>
            <div className="step-line"></div>
            <div className={`step-item ${step >= 4 ? 'active' : ''}`} onClick={() => setStep(4)}>
              <div className="step-circle">4</div>
              <span>Review & Publish</span>
            </div>
          </div>

          {errorMessage && (
            <div className="alert-error-banner mt-3">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage ? (
            <div className="publish-success-state">
              <div className="success-icon-badge">✓</div>
              <h2>Listing Live on Aangan!</h2>
              <p>{successMessage}</p>

              {createdProperty && (
                <div className="created-property-preview">
                  <img src={createdProperty.imageUrl} alt={createdProperty.title} />
                  <div className="preview-info">
                    <h4>{createdProperty.title}</h4>
                    <p className="preview-price">{createdProperty.displayPrice}</p>
                    <p className="preview-location">📍 {createdProperty.location}</p>
                  </div>
                </div>
              )}

              <div className="success-action-btns">
                <Link href="/search" className="btn-primary btn-lg">
                  View in Search Feed
                </Link>
                <button 
                  type="button" 
                  className="btn-secondary btn-lg"
                  onClick={() => {
                    setSuccessMessage('');
                    setStep(1);
                    setTitle('');
                    setPrice('');
                  }}
                >
                  List Another Property
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="wizard-form-body">
              {/* STEP 1: BASICS */}
              {step === 1 && (
                <div className="wizard-step-content">
                  <h3>Step 1: Property Basic Info</h3>
                  
                  <div className="form-group">
                    <label>I want to <span className="req-star">*</span></label>
                    <div className="toggle-btn-group">
                      <button 
                        type="button" 
                        className={`toggle-option ${purpose === 'sale' ? 'active' : ''}`}
                        onClick={() => setPurpose('sale')}
                      >
                        Sell Property
                      </button>
                      <button 
                        type="button" 
                        className={`toggle-option ${purpose === 'rent' ? 'active' : ''}`}
                        onClick={() => setPurpose('rent')}
                      >
                        Rent Out Property
                      </button>
                    </div>
                  </div>

                  <div className="form-group mt-3">
                    <label>Property Title <span className="req-star">*</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. Luxurious 2 BHK Flat near Rankala Lake"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group mt-3">
                    <label>Property Type</label>
                    <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
                      <option>Apartment / Flat</option>
                      <option>Independent House / Villa</option>
                      <option>Residential Plot / Land</option>
                      <option>Penthouse</option>
                      <option>Commercial Space</option>
                    </select>
                  </div>

                  <div className="wizard-footer-nav mt-4">
                    <div></div>
                    <button type="button" className="btn-primary" onClick={() => {
                      if (!title.trim()) {
                        setErrorMessage('Please enter a property title before proceeding.');
                        return;
                      }
                      setErrorMessage('');
                      setStep(2);
                    }}>
                      Next: Location & Price ➔
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: LOCATION & PRICE */}
              {step === 2 && (
                <div className="wizard-step-content">
                  <h3>Step 2: Location & Pricing</h3>

                  <div className="form-group">
                    <label>Select Locality in Kolhapur <span className="req-star">*</span></label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)}>
                      {KOLHAPUR_LOCALITIES.map((loc) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                      <option value="Other">Other Locality...</option>
                    </select>
                  </div>

                  {location === 'Other' && (
                    <div className="form-group mt-2">
                      <label>Specify Locality Name</label>
                      <input 
                        type="text"
                        placeholder="Enter locality name in Kolhapur"
                        value={customLocality}
                        onChange={(e) => setCustomLocality(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="form-group mt-3">
                    <label>Expected Price (in ₹) <span className="req-star">*</span></label>
                    <input 
                      type="number"
                      placeholder="e.g. 4500000 for 45 Lacs"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                    <div className="price-preview-badge">
                      Expected Display Price: <strong>{calculateDisplayPrice(numericPrice)}</strong>
                    </div>
                  </div>

                  <div className="wizard-footer-nav mt-4">
                    <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                      ← Back
                    </button>
                    <button type="button" className="btn-primary" onClick={() => {
                      if (!numericPrice || numericPrice <= 0) {
                        setErrorMessage('Please enter a valid price.');
                        return;
                      }
                      setErrorMessage('');
                      setStep(3);
                    }}>
                      Next: Specs & Cover Image ➔
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: SPECS & PHOTOS */}
              {step === 3 && (
                <div className="wizard-step-content">
                  <h3>Step 3: Property Specs & Cover Photo</h3>

                  <div className="form-group">
                    <label>Bedrooms (BHK)</label>
                    <div className="bhk-pill-group">
                      {[1, 2, 3, 4].map((n) => (
                        <button 
                          key={n}
                          type="button" 
                          className={`bhk-pill ${bedrooms === n ? 'active' : ''}`}
                          onClick={() => setBedrooms(n)}
                        >
                          {n} BHK
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group mt-3">
                    <label>Carpet Area (sq.ft)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 1200"
                      value={areaSqft}
                      onChange={(e) => setAreaSqft(Number(e.target.value))}
                    />
                  </div>

                  <div className="form-group mt-3">
                    <label>Amenities</label>
                    <div className="amenities-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                      {AMENITIES_LIST.map((amenity) => (
                        <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedAmenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAmenities([...selectedAmenities, amenity]);
                              } else {
                                setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                              }
                            }}
                          />
                          {amenity}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group mt-4">
                    <label>Choose Cover Photo Preset</label>
                    <div className="preset-photo-grid">
                      {PRESET_IMAGES.map((img, idx) => (
                        <div 
                          key={idx}
                          className={`preset-thumb ${selectedImage === img && !customImageUrl ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedImage(img);
                            setCustomImageUrl('');
                          }}
                        >
                          <img src={img} alt={`Preset ${idx + 1}`} />
                          {selectedImage === img && !customImageUrl && <span className="check-tag">✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group mt-3">
                    <label>Or Upload Custom Image URL</label>
                    <input 
                      type="url" 
                      placeholder="https://example.com/my-property.jpg" 
                      value={customImageUrl} 
                      onChange={(e) => setCustomImageUrl(e.target.value)} 
                    />
                  </div>

                  <div className="wizard-footer-nav mt-4">
                    <button type="button" className="btn-secondary" onClick={() => setStep(2)}>
                      ← Back
                    </button>
                    <button type="button" className="btn-primary" onClick={() => setStep(4)}>
                      Next: Preview & Publish ➔
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & PUBLISH */}
              {step === 4 && (
                <div className="wizard-step-content">
                  <h3>Step 4: Live Listing Preview</h3>

                  <div className="live-card-preview-container">
                    <div className="property-card preview-card" style={{ maxWidth: '380px', margin: '0 auto' }}>
                      <div className="card-img-wrapper">
                        <img src={finalImage} alt={title} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                        <span className="badge">Owner Verified</span>
                      </div>
                      <div className="card-content">
                        <div className="price">{calculateDisplayPrice(numericPrice)}</div>
                        <h4 style={{ fontSize: '1.25rem', marginBottom: '5px', fontWeight: 600, color: 'var(--dark)' }}>{title || 'Property Title'}</h4>
                        <p className="location" style={{ marginBottom: '15px', color: 'var(--text-muted)' }}>📍 {finalLocation}, Kolhapur</p>
                        <div className="features" style={{ marginBottom: '20px', paddingBottom: '15px' }}>
                          <span>🛏️ {bedrooms} BHK</span>
                          <span className="dot" style={{ margin: '0 8px' }}>·</span>
                          <span>📐 {areaSqft} sqft</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="wizard-footer-nav mt-4">
                    <button type="button" className="btn-secondary" onClick={() => setStep(3)}>
                      ← Back
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary btn-lg">
                      {loading ? 'Publishing Property...' : '🚀 Publish Property Now'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </main>

      <Footer />

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsLoginOpen(false);
          setErrorMessage('');
        }}
      />
    </>
  );
}

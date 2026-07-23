'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { getProperties } from '@/actions/properties';
import { motion, Variants } from 'framer-motion';

type Property = {
  id: string;
  title: string;
  price: number;
  displayPrice: string;
  location: string;
  bedrooms: number;
  areaSqft: number;
  imageUrl: string;
  badge: string | null;
  amenities: string | null;
  description: string | null;
};

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

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

export default function FeaturedProperties({ initialProperties }: { initialProperties: Property[] }) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialProperties.length === 8);
  
  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    
    try {
      const moreProperties = await getProperties({ skip: properties.length, take: 8 });
      if (moreProperties.length < 8) {
        setHasMore(false);
      }
      setProperties(prev => [...prev, ...moreProperties]);
    } catch (error) {
      console.error("Failed to load more properties", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="featured-properties">
      <div className="section-header">
        <h3>Featured Properties</h3>
        <p>Handpicked exclusive properties for you</p>
      </div>
      
      <div className="property-grid">
        {properties.map((property, idx) => (
          <motion.div
            key={property.id}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            custom={idx}
          >
            <Link href={`/property/${property.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="property-card">
                <div className="card-img-wrapper">
                  <img src={property.imageUrl} alt={property.title} />
                  {property.badge && <span className="badge">{property.badge}</span>}
                </div>
                <div className="card-content">
                  <div className="price">{property.displayPrice}</div>
                  <h4>{property.title}</h4>
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
                    <span>🛏️ {property.bedrooms} BHK</span>
                    <span className="dot">·</span>
                    <span>📐 {property.areaSqft} sqft</span>
                  </div>
                  <button className="btn-contact">Contact Seller</button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="load-more-container" style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            className="btn-primary" 
            onClick={loadMore} 
            disabled={loading}
            style={{ padding: '12px 30px', fontSize: '1.1rem' }}
          >
            {loading ? 'Loading...' : 'Show More Properties'}
          </button>
        </div>
      )}
    </section>
  );
}

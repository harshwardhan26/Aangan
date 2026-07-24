'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import LocalityAutocomplete from './LocalityAutocomplete';

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

export default function SearchFilterSidebar({ isModal, onClose }: { isModal?: boolean; onClose?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Read current URL params
  const currentQuery = searchParams.get('q') || '';
  const currentLocality = searchParams.get('locality') || '';
  const currentBhk = searchParams.get('bhk') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';
  const type = searchParams.get('type') || 'sell';
  const currentPropertyType = searchParams.get('propertyType') || 'all';
  const currentMinArea = searchParams.get('minArea') || '';
  const currentMaxArea = searchParams.get('maxArea') || '';
  const currentAmenities = searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : [];
  const currentOccupancyType = searchParams.get('occupancyType') || 'Any';
  const currentGenderPref = searchParams.get('genderPreference') || 'Any';
  
  const isRentOrColiving = type === 'rent' || type === 'coliving';
  const defaultMaxPrice = isRentOrColiving ? '100000' : '30000000';
  const currentMaxPrice = searchParams.get('maxPrice') || defaultMaxPrice;

  const [q, setQ] = useState(currentQuery);
  const [locality, setLocality] = useState(currentLocality);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [bhk, setBhk] = useState(currentBhk);
  const [sort, setSort] = useState(currentSort);
  const [propertyType, setPropertyType] = useState(currentPropertyType);
  const [minArea, setMinArea] = useState(currentMinArea);
  const [maxArea, setMaxArea] = useState(currentMaxArea);
  const [amenities, setAmenities] = useState<string[]>(currentAmenities);
  const [occupancyType, setOccupancyType] = useState(currentOccupancyType);
  const [genderPreference, setGenderPreference] = useState(currentGenderPref);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const newType = searchParams.get('type') || 'sell';
    const isRentOrColiving = newType === 'rent' || newType === 'coliving';
    
    setQ(searchParams.get('q') || '');
    setLocality(searchParams.get('locality') || '');
    setMaxPrice(searchParams.get('maxPrice') || (isRentOrColiving ? '100000' : '30000000'));
    setBhk(searchParams.get('bhk') || 'all');
    setSort(searchParams.get('sort') || 'newest');
    setPropertyType(searchParams.get('propertyType') || 'all');
    setMinArea(searchParams.get('minArea') || '');
    setMaxArea(searchParams.get('maxArea') || '');
    setAmenities(searchParams.get('amenities') ? searchParams.get('amenities')!.split(',') : []);
    setOccupancyType(searchParams.get('occupancyType') || 'Any');
    setGenderPreference(searchParams.get('genderPreference') || 'Any');
  }, [searchParams]);

  const updateFilters = (newFilters: { [key: string]: string | string[] }) => {
    if (isModal) return;

    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newFilters).forEach(([key, val]) => {
      if (!val || val === 'all' || val === 'All Localities' || val === 'Any' || (Array.isArray(val) && val.length === 0) || (key === 'maxPrice' && val === '30000000') || (key === 'sort' && val === 'newest')) {
        params.delete(key);
      } else {
        params.set(key, Array.isArray(val) ? val.join(',') : val);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setQ('');
    setLocality('');
    setMaxPrice('30000000');
    setBhk('all');
    setSort('newest');
    setPropertyType('all');
    setMinArea('');
    setMaxArea('');
    setAmenities([]);
    setOccupancyType('Any');
    setGenderPreference('Any');
    router.push(pathname);
  };

  const formatRs = (numStr: string) => {
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return isRentOrColiving ? '₹1 L / mo' : '₹3 Cr';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(1).replace(/\.0$/, '')} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = amenities.includes(amenity)
      ? amenities.filter(a => a !== amenity)
      : [...amenities, amenity];
    setAmenities(newAmenities);
    updateFilters({ amenities: newAmenities });
  };

  return (
    <>
      <button 
        className="mobile-filter-toggle" 
        onClick={() => setIsMobileOpen(true)}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        Filters
      </button>

      <aside className={`search-filter-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="filter-card">
        <div className="filter-card-header">
          <h3>Filter Properties</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="btn-text-clear" onClick={handleClear}>Reset</button>
            <button className="btn-text-clear mobile-filter-close" onClick={() => setIsMobileOpen(false)}>&times;</button>
            {isModal && onClose && (
              <button className="btn-text-clear" onClick={onClose}>&times;</button>
            )}
          </div>
        </div>

        {/* Text Query Filter */}
        <div className="filter-group">
          <label>Keyword / Title</label>
          <div className="search-input-wrapper">
            <input 
              type="text" 
              placeholder="Search e.g. Villa, Flat..." 
              value={q} 
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && updateFilters({ q })}
              onBlur={() => updateFilters({ q })}
            />
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* Locality Filter */}
        <div className="filter-group">
          <label>Locality in Kolhapur</label>
          <LocalityAutocomplete
            value={locality}
            onChange={(val) => setLocality(val)}
            onSelect={(val) => updateFilters({ locality: val })}
            placeholder="Search locality..."
            inputClassName="filter-input-unified"
          />
        </div>

        {/* Property Type Filter */}
        <div className="filter-group">
          <label>Property Type</label>
          <select 
            value={propertyType} 
            onChange={(e) => {
              setPropertyType(e.target.value);
              updateFilters({ propertyType: e.target.value });
            }}
          >
            <option value="all">All Types</option>
            <option value="Apartment/Flat">Apartment/Flat</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
            <option value="Row House">Row House</option>
            <option value="PG">PG</option>
          </select>
        </div>

        {/* Max Budget Filter */}
        <div className="filter-group">
          <div className="label-with-value">
            <label>Max Budget {isRentOrColiving ? '(per month)' : ''}</label>
            <span className="budget-val-badge">{formatRs(maxPrice)}</span>
          </div>
          <input 
            type="range" 
            min={isRentOrColiving ? "1000" : "500000"} 
            max={isRentOrColiving ? "100000" : "30000000"} 
            step={isRentOrColiving ? "1000" : "500000"} 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)}
            onMouseUp={(e) => updateFilters({ maxPrice: e.currentTarget.value })}
            onTouchEnd={(e) => updateFilters({ maxPrice: e.currentTarget.value })}
            className="filter-range-slider"
          />
          <div className="range-bounds">
            <span>{isRentOrColiving ? '₹1K' : '₹5 L'}</span>
            <span>{isRentOrColiving ? '₹1 L' : '₹3 Cr'}</span>
          </div>
        </div>

        {/* Bedrooms / BHK Filter (Hide for Coliving) */}
        {type !== 'coliving' && (
          <div className="filter-group">
            <label>Bedrooms (BHK)</label>
            <div className="bhk-pills">
              {['all', '1', '2', '3', '4'].map((val) => (
                <button 
                  key={val} 
                  className={`bhk-pill ${bhk === val ? 'active' : ''}`}
                  onClick={() => {
                    setBhk(val);
                    updateFilters({ bhk: val });
                  }}
                >
                  {val === 'all' ? 'All' : val === '4' ? '4+ BHK' : `${val} BHK`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Area / Size Filter */}
        <div className="filter-group">
          <label>Area (sq ft)</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="number" 
              placeholder="Min" 
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              onBlur={() => updateFilters({ minArea })}
              onKeyDown={(e) => e.key === 'Enter' && updateFilters({ minArea })}
              className="filter-input-unified"
              style={{ flex: 1 }}
            />
            <input 
              type="number" 
              placeholder="Max" 
              value={maxArea}
              onChange={(e) => setMaxArea(e.target.value)}
              onBlur={() => updateFilters({ maxArea })}
              onKeyDown={(e) => e.key === 'Enter' && updateFilters({ maxArea })}
              className="filter-input-unified"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* Co-living Specific Filters */}
        {type === 'coliving' && (
          <>
            <div className="filter-group">
              <label>Occupancy Type</label>
              <select 
                value={occupancyType} 
                onChange={(e) => {
                  setOccupancyType(e.target.value);
                  updateFilters({ occupancyType: e.target.value });
                }}
              >
                <option value="Any">Any</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Triple">Triple</option>
                <option value="Shared">Shared</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Gender Preference</label>
              <select 
                value={genderPreference} 
                onChange={(e) => {
                  setGenderPreference(e.target.value);
                  updateFilters({ genderPreference: e.target.value });
                }}
              >
                <option value="Any">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </>
        )}

        {/* Amenities Filter */}
        <div className="filter-group">
          <label>Amenities</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            {AMENITIES_LIST.map((amenity) => (
              <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.95rem', color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  style={{ accentColor: 'var(--primary)', width: '18px', height: '18px' }}
                />
                {amenity}
              </label>
            ))}
          </div>
        </div>

        {/* Sort Filter */}
        <div className="filter-group">
          <label>Sort Results By</label>
          <select 
            value={sort} 
            onChange={(e) => {
              setSort(e.target.value);
              updateFilters({ sort: e.target.value });
            }}
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      
      {isModal && (
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)', background: 'white', position: 'sticky', bottom: 0, zIndex: 10 }}>
          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '12px' }}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              if (q) params.set('q', q); else params.delete('q');
              if (locality && locality !== 'All Localities') params.set('locality', locality); else params.delete('locality');
              if (maxPrice && maxPrice !== '30000000' && maxPrice !== '100000') params.set('maxPrice', maxPrice); else params.delete('maxPrice');
              if (bhk && bhk !== 'all') params.set('bhk', bhk); else params.delete('bhk');
              if (sort && sort !== 'newest') params.set('sort', sort); else params.delete('sort');
              if (propertyType && propertyType !== 'all') params.set('propertyType', propertyType); else params.delete('propertyType');
              if (minArea) params.set('minArea', minArea); else params.delete('minArea');
              if (maxArea) params.set('maxArea', maxArea); else params.delete('maxArea');
              if (amenities.length > 0) params.set('amenities', amenities.join(',')); else params.delete('amenities');
              if (occupancyType && occupancyType !== 'Any') params.set('occupancyType', occupancyType); else params.delete('occupancyType');
              if (genderPreference && genderPreference !== 'Any') params.set('genderPreference', genderPreference);
              
              router.push(`/search?${params.toString()}`);
              if (onClose) onClose();
            }}
          >
            Apply Filters
          </button>
        </div>
      )}
      {isMobileOpen && (
        <div className="mobile-filter-actions">
          <button className="btn-primary" onClick={() => setIsMobileOpen(false)}>Apply Filters</button>
        </div>
      )}
    </aside>
    </>
  );
}

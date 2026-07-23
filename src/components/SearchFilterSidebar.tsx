'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const localities = [
  'All Localities',
  'Tarabai Park',
  'Nagala Park',
  'Rajarampuri',
  'Shahupuri',
  'Pratibha Nagar',
  'Ruikar Colony',
  'Shalini Palace',
  'Padmaraje Park',
  'Subhash Nagar',
  'Hari Om Nagar',
  'Phulewadi',
  'Kadamwadi',
  'Bapat Camp',
  'Mangalwar Peth',
  'Kasba Bawada',
  'Kalamba',
  'Kagal Road / MIDC'
];

export default function SearchFilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Read current URL params
  const currentQuery = searchParams.get('q') || '';
  const currentLocality = searchParams.get('locality') || 'All Localities';
  const currentMaxPrice = searchParams.get('maxPrice') || '30000000';
  const currentBhk = searchParams.get('bhk') || 'all';
  const currentSort = searchParams.get('sort') || 'newest';

  const [q, setQ] = useState(currentQuery);
  const [locality, setLocality] = useState(currentLocality);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);
  const [bhk, setBhk] = useState(currentBhk);
  const [sort, setSort] = useState(currentSort);

  // Sync state with URL params on navigation
  useEffect(() => {
    setQ(searchParams.get('q') || '');
    setLocality(searchParams.get('locality') || 'All Localities');
    setMaxPrice(searchParams.get('maxPrice') || '30000000');
    setBhk(searchParams.get('bhk') || 'all');
    setSort(searchParams.get('sort') || 'newest');
  }, [searchParams]);

  // Helper to push updated search params to URL
  const updateFilters = (newFilters: { [key: string]: string }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newFilters).forEach(([key, val]) => {
      if (!val || val === 'all' || val === 'All Localities' || (key === 'maxPrice' && val === '30000000') || (key === 'sort' && val === 'newest')) {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setQ('');
    setLocality('All Localities');
    setMaxPrice('30000000');
    setBhk('all');
    setSort('newest');
    router.push(pathname);
  };

  const formatRs = (numStr: string) => {
    const num = parseInt(numStr, 10);
    if (isNaN(num)) return '₹3 Cr';
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(1)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(0)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <aside className="search-filter-sidebar">
      <div className="filter-card">
        <div className="filter-card-header">
          <h3>Filter Properties</h3>
          <button className="btn-text-clear" onClick={handleClear}>Clear All</button>
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
          <select 
            value={locality} 
            onChange={(e) => {
              setLocality(e.target.value);
              updateFilters({ locality: e.target.value });
            }}
          >
            {localities.map((loc, i) => (
              <option key={i} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* Max Budget Filter */}
        <div className="filter-group">
          <div className="label-with-value">
            <label>Max Budget</label>
            <span className="budget-val-badge">{formatRs(maxPrice)}</span>
          </div>
          <input 
            type="range" 
            min="500000" 
            max="30000000" 
            step="500000" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)}
            onMouseUp={() => updateFilters({ maxPrice })}
            onTouchEnd={() => updateFilters({ maxPrice })}
            className="filter-range-slider"
          />
          <div className="range-bounds">
            <span>₹5 L</span>
            <span>₹3 Cr</span>
          </div>
        </div>

        {/* Bedrooms / BHK Filter */}
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
    </aside>
  );
}

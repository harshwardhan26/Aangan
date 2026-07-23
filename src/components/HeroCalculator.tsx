'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Suspense } from 'react';
import LocalityAutocomplete from './LocalityAutocomplete';
import SearchFilterSidebar from './SearchFilterSidebar';

function FilterBadgeComponent() {
  const searchParams = useSearchParams();
  const activeFiltersCount = Array.from(searchParams.keys()).filter(key => key !== 'sort' && key !== 'type' && key !== 'q').length;
  return <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>;
}

function FilterBadge() {
  return (
    <Suspense fallback={<span>Filters</span>}>
      <FilterBadgeComponent />
    </Suspense>
  );
}

export default function HeroCalculator() {
  const router = useRouter();
  const [calcType, setCalcType] = useState('flat');
  const [calcArea, setCalcArea] = useState('6200');
  const [calcDesiredSize, setCalcDesiredSize] = useState('1000');
  const [calcCustomRate, setCalcCustomRate] = useState('');
  const [calcBudget, setCalcBudget] = useState('5000000');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setFilterModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('aangan_user_budget', calcBudget);
    } catch (e) {
      // ignore
    }
  }, [calcBudget]);

  const localityMap: { [key: string]: string } = {
    '6200': 'Tarabai Park',
    '6400': 'Nagala Park',
    '6600': 'Rajarampuri',
    '5800': 'Shahupuri',
    '5200': 'Pratibha Nagar',
    '5500': 'Ruikar Colony',
    '5400': 'Shalini Palace',
    '4800': 'Padmaraje Park',
    '4400': 'Subhash Nagar',
    '4300': 'Hari Om Nagar',
    '4100': 'Phulewadi',
    '4500': 'Bapat Camp',
    '4900': 'Mangalwar Peth',
    '3800': 'Kasba Bawada',
    '3500': 'Kalamba',
    '3200': 'Kagal Road / MIDC',
  };

  const fmtRs = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN');

  const getRate = () => {
    if (calcType === 'flat') {
      if (calcArea === 'custom') {
        return parseFloat(calcCustomRate) || 0;
      }
      return parseFloat(calcArea);
    }
    return parseFloat(calcCustomRate) || 0;
  };

  const rate = getRate();
  const budget = parseFloat(calcBudget);
  const desiredSize = parseFloat(calcDesiredSize) || 0;

  let rateOut = '--';
  let achievableOut = '--';
  let neededOut = '--';
  let verdict = 'Enter a rate for this area to see the fit.';
  let isHighlight = false;

  if (rate && rate > 0) {
    const achievableSize = budget / rate;
    const neededBudget = desiredSize * rate;

    rateOut = fmtRs(rate) + ' / sq ft';
    achievableOut = Math.round(achievableSize).toLocaleString('en-IN') + ' sq ft';
    neededOut = fmtRs(neededBudget);

    if (achievableSize >= desiredSize) {
      const surplus = budget - neededBudget;
      verdict = 'This budget comfortably covers the desired size — about ' + fmtRs(surplus) + ' to spare.';
    } else {
      const gap = neededBudget - budget;
      const pctShort = Math.round((gap / neededBudget) * 100);
      verdict = 'This budget falls short by about ' + fmtRs(gap) + ' (' + pctShort + '%) for the desired size in this area.';
    }
  }

  return (
    <section className="hero" style={{ backgroundImage: "url('/assets/images/hero_bg.png')" }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Find a home in Kolhapur<br />where your heart truly belongs.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          Step into your own 'Aangan' — a space for new beginnings, family laughter, and lifelong memories.
        </motion.p>

        <motion.div 
          className="calculator-wrapper"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
        >
          <div className="calculator-container usp-highlight">
            <h2>Does your budget actually fit where you want to live?</h2>

            <div className="calc-main">
              <div className="calc-dropdowns">
                <div className="field-group">
                  <label htmlFor="calcType" className="field-label">Property Category</label>
                  <select id="calcType" value={calcType} onChange={(e) => setCalcType(e.target.value)}>
                    <option value="flat">Apartment / Flat</option>
                    <option value="villa">Independent Villa / House</option>
                    <option value="plot">Residential Plot / Land</option>
                    <option value="bungalow">Row House / Bungalow</option>
                    <option value="commercial">Commercial Space / Shop</option>
                    <option value="agri">Agricultural Land</option>
                  </select>
                </div>

                {calcType !== 'agri' && (
                  <div className="field-group">
                    <label htmlFor="calcArea" className="field-label">Target Locality</label>
                    <select id="calcArea" value={calcArea} onChange={(e) => setCalcArea(e.target.value)}>
                      <option value="6200">Tarabai Park</option>
                      <option value="6400">Nagala Park</option>
                      <option value="6600">Rajarampuri</option>
                      <option value="5800">Shahupuri</option>
                      <option value="5200">Pratibha Nagar</option>
                      <option value="5500">Ruikar Colony</option>
                      <option value="5400">Shalini Palace</option>
                      <option value="4800">Padmaraje Park</option>
                      <option value="4400">Subhash Nagar</option>
                      <option value="4300">Hari Om Nagar</option>
                      <option value="4100">Phulewadi</option>
                      <option value="4800">Kadamwadi</option>
                      <option value="4500">Bapat Camp</option>
                      <option value="4900">Mangalwar Peth</option>
                      <option value="3800">Kasba Bawada</option>
                      <option value="3500">Kalamba</option>
                      <option value="3200">Kagal Road / MIDC</option>
                      <option value="custom">Other / Custom Rate</option>
                    </select>
                  </div>
                )}

                <div className="field-group">
                  <label htmlFor="calcDesiredSize" className="field-label">Desired Size (sq ft)</label>
                  <input
                    type="number"
                    id="calcDesiredSize"
                    placeholder="e.g. 1000"
                    value={calcDesiredSize}
                    onChange={(e) => setCalcDesiredSize(e.target.value)}
                  />
                </div>
              </div>

              {(calcType !== 'flat' || calcArea === 'custom') && (
                <div className="field-group mt-3">
                  <label htmlFor="calcCustomRate" className="field-label">Expected Rate (₹ / sq ft)</label>
                  <input
                    type="number"
                    id="calcCustomRate"
                    placeholder="Enter rate per sq ft"
                    value={calcCustomRate}
                    onChange={(e) => setCalcCustomRate(e.target.value)}
                  />
                </div>
              )}

              <div className="calc-slider-container">
                <label>Your budget: <span id="calcBudgetOut" className="budget-highlight">{fmtRs(budget)}</span></label>

                {(() => {
                  const min = 500000;
                  const max = 30000000;
                  const progress = ((budget - min) / (max - min)) * 100;

                  return (
                    <div className="slider-wrapper" style={{ '--progress': `${progress}%` } as React.CSSProperties}>
                      <span className="slider-label">5 Lacs</span>
                      <div className="slider-track-container">
                        <div className="slider-tooltip">{fmtRs(budget)}</div>
                        <input
                          type="range"
                          min="500000"
                          max="30000000"
                          step="100000"
                          value={calcBudget}
                          id="calcBudget"
                          onChange={(e) => setCalcBudget(e.target.value)}
                        />
                      </div>
                      <span className="slider-label">3 Cr</span>
                    </div>
                  );
                })()}
              </div>

              <div className="calc-results-boxes">
                <div className="result-box">
                  <div className="result-label">Rate assumed</div>
                  <div className="result-value" id="calcRateOut">{rateOut}</div>
                </div>
                <div className="result-box">
                  <div className="result-label">Size achievable</div>
                  <div className="result-value" id="calcAchievable">{achievableOut}</div>
                </div>
                <div className="result-box highlight">
                  <div className="result-label">Budget needed</div>
                  <div className="result-value" id="calcNeeded">{neededOut}</div>
                </div>
              </div>
              <div className="calc-verdict-box" id="calcVerdictBox">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <p>{verdict}</p>
              </div>

              <div className="calc-actions">
                <button
                  className="btn-calc-primary"
                  onClick={() => {
                    const selLocality = localityMap[calcArea] || '';
                    router.push(`/search?maxPrice=${calcBudget}&locality=${encodeURIComponent(selLocality)}`);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  Search in Budget
                </button>

                <button
                  className="btn-calc-secondary"
                  onClick={() => {
                    router.push(`/search?maxPrice=${calcBudget}`);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                  Explore Other Localities
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Search */}
          <div className="secondary-search glassmorphism">
            <div className="search-bar-unified">
              <div className="search-icon-wrapper">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <LocalityAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                onSubmit={(val) => {
                  if (val.trim()) {
                    router.push(`/search?locality=${encodeURIComponent(val.trim())}`);
                  }
                }}
                placeholder="Search by locality, e.g. Tarabai Park, Rajarampuri..."
                inputClassName="locality-input-unified w-100"
              />
              <button
                className="btn-primary search-btn-inner"
                onClick={() => {
                  if (searchQuery.trim()) {
                    router.push(`/search?locality=${encodeURIComponent(searchQuery.trim())}`);
                  } else {
                    router.push('/search');
                  }
                }}
              >
                Search
              </button>
            </div>

            <button 
              className="filters-btn-glass" 
              onClick={() => setFilterModalOpen(true)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="21" x2="4" y2="14"></line>
                <line x1="4" y1="10" x2="4" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12" y2="3"></line>
                <line x1="20" y1="21" x2="20" y2="16"></line>
                <line x1="20" y1="12" x2="20" y2="3"></line>
                <line x1="1" y1="14" x2="7" y2="14"></line>
                <line x1="9" y1="8" x2="15" y2="8"></line>
                <line x1="17" y1="16" x2="23" y2="16"></line>
              </svg>
              <FilterBadge />
            </button>
          </div>
        </motion.div>
      </div>

      {isFilterModalOpen && (
        <div 
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 9999,
            display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px'
          }}
          onClick={() => setFilterModalOpen(false)}
        >
          <div 
            style={{
              background: 'var(--light)', borderRadius: '12px', width: '100%', maxWidth: '350px',
              maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <SearchFilterSidebar isModal={true} onClose={() => setFilterModalOpen(false)} />
          </div>
        </div>
      )}
    </section>
  );
}

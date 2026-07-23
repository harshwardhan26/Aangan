'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import LoginModal from './LoginModal';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useSearchParams, usePathname } from 'next/navigation';
import { Suspense } from 'react';

function NavbarContent() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentUser = session?.user as any;

  const handleLogout = () => {
    signOut();
  };

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return 'U';
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nameStr.slice(0, 2).toUpperCase();
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <Link href="/" className="logo">
          <img src="/assets/images/logo-black.png" alt="Aangan" className="logo-img" />
        </Link>
        <nav className="nav-links">
          <Link href="/search" className={!searchParams.get('type') && pathname !== '/sell' ? 'active' : ''}>Buy</Link>
          <Link href="/search?type=rent" className={searchParams.get('type') === 'rent' ? 'active' : ''}>Rent</Link>
          <Link href="/sell" className={pathname === '/sell' ? 'active' : ''}>Sell</Link>
          <Link href="/search?type=coliving" className={searchParams.get('type') === 'coliving' ? 'active' : ''}>Co-living</Link>
        </nav>
        <div className="nav-actions">
          <Link href="/list-property" className="btn-nav-sell">
            <span className="plus-icon">+</span>
            List Property
            <span className="free-badge">FREE</span>
          </Link>
          
          {currentUser ? (
            <div className="user-avatar-container">
              <div 
                className="user-avatar-circle" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                title={currentUser.name || currentUser.phone}
              >
                <span>{getInitials(currentUser.name || currentUser.phone)}</span>
              </div>

              {isDropdownOpen && (
                <div className="user-menu-dropdown">
                  <div className="user-dropdown-header">
                    <div className="dropdown-avatar-large">
                      {getInitials(currentUser.name || currentUser.phone)}
                    </div>
                    <div className="user-dropdown-info">
                      <h4>{currentUser.name || 'Aangan Member'}</h4>
                      <p>{currentUser.phone || currentUser.email}</p>
                      <span className="user-role-tag">{currentUser.role === 'seller' ? 'Owner / Agent' : 'Buyer / Tenant'}</span>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-menu-list">
                    <Link href="/dashboard" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span>My Activity & Searches</span>
                    </Link>
                    <Link href="/dashboard" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                      <span>Saved Properties</span>
                    </Link>
                    <Link href="/dashboard" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                      <span>My Property Listings</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={() => {
                      setIsDropdownOpen(false);
                      window.location.href = '/dashboard';
                    }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      <span>Account Settings</span>
                    </button>
                  </div>

                  <div className="dropdown-divider"></div>

                  <button className="dropdown-logout-btn" onClick={() => { setIsDropdownOpen(false); handleLogout(); }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-nav-login" onClick={() => setIsLoginOpen(true)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Login
            </button>
          )}
        </div>
      </header>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<header className="navbar"><div className="logo">Loading...</div></header>}>
      <NavbarContent />
    </Suspense>
  );
}

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-col brand-col">
          <Link href="/" className="logo">
            <img src="/assets/images/logo-white.png" alt="Aangan" className="logo-img" />
          </Link>
          <p>Your trusted real estate partner for finding the perfect home.</p>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Contact Us</a>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <a href="#">Buy Property</a>
          <a href="#">Rent Property</a>
          <a href="#">Home Loans</a>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Aangan Real Estate. All rights reserved.</p>
      </div>
    </footer>
  );
}

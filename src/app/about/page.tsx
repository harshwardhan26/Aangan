import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Aangan Real Estate',
  description: 'Learn more about Aangan Real Estate, Kolhapur\'s trusted property platform.',
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="static-page-container" style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>About Aangan</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.8' }}>
          Aangan is Kolhapur's premier digital real estate platform, designed to bring transparency, trust, and premium experiences to property hunting.
        </p>
        
        <div className="content-section" style={{ marginBottom: '40px' }}>
          <h2>Our Mission</h2>
          <p style={{ lineHeight: '1.7', marginTop: '15px' }}>
            We believe that finding a home shouldn't be a struggle. Our mission is to connect buyers, sellers, and renters through a seamless, technology-driven platform that puts user experience and data accuracy first.
          </p>
        </div>

        <div className="content-section">
          <h2>Why Choose Us?</h2>
          <ul style={{ lineHeight: '1.7', marginTop: '15px', paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}><strong>Verified Listings:</strong> Every property on our platform goes through a strict verification process.</li>
            <li style={{ marginBottom: '10px' }}><strong>Direct Connections:</strong> No hidden middlemen. We connect you directly with verified sellers and trusted agents.</li>
            <li style={{ marginBottom: '10px' }}><strong>Premium Experience:</strong> A modern, intuitive interface built for speed and clarity.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}

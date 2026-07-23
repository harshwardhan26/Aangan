import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers | Aangan Real Estate',
  description: 'Join the Aangan team and help revolutionize real estate in Kolhapur.',
};

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="static-page-container" style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Careers at Aangan</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.8' }}>
          We're building the future of real estate in Kolhapur. Come join a team of passionate engineers, designers, and real estate experts.
        </p>
        
        <div className="content-section" style={{ marginBottom: '40px', background: '#f8fafc', padding: '30px', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <h2 style={{ marginBottom: '10px' }}>Open Positions</h2>
          <p style={{ color: 'var(--text-muted)' }}>We currently do not have any open positions. Please check back later or send your resume to careers@aangan.com.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}

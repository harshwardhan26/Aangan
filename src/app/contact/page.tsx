import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Aangan Real Estate',
  description: 'Get in touch with the Aangan Real Estate team in Kolhapur.',
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="static-page-container" style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Contact Us</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px', lineHeight: '1.8' }}>
          Have questions about a property or need help with your account? Our Kolhapur-based team is here to help.
        </p>
        
        <div className="content-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '15px' }}>Office Address</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Aangan Real Estate Tech<br />
              4th Floor, Tech Park<br />
              Tarabai Park, Kolhapur<br />
              Maharashtra 416003
            </p>
          </div>
          
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '15px' }}>Get in Touch</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '10px' }}>
              <strong>Email:</strong> support@aangan.com
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '10px' }}>
              <strong>Phone:</strong> +91 98765 43210
            </p>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
              <strong>Hours:</strong> Mon - Sat, 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

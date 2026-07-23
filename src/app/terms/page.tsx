import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Aangan Real Estate',
  description: 'Terms of Service for Aangan Real Estate.',
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="static-page-container" style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Last updated: July 2026</p>
        
        <div className="content-section" style={{ marginBottom: '30px', lineHeight: '1.7' }}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Aangan (the "Platform"), you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </div>

        <div className="content-section" style={{ marginBottom: '30px', lineHeight: '1.7' }}>
          <h2>2. User Accounts & Authentication</h2>
          <p>
            To use certain features of the Platform (such as saving properties or contacting sellers), you must register for an account using our Google OAuth integration. You are responsible for maintaining the confidentiality of your account and password.
          </p>
        </div>

        <div className="content-section" style={{ marginBottom: '30px', lineHeight: '1.7' }}>
          <h2>3. Property Inquiries (Leads)</h2>
          <p>
            When you submit a contact request for a property, you authorize Aangan to share your contact information (name, phone, email) with the respective property seller or agent. Aangan acts solely as a platform to facilitate this connection and is not a party to any subsequent real estate transactions.
          </p>
        </div>

        <div className="content-section" style={{ marginBottom: '30px', lineHeight: '1.7' }}>
          <h2>4. Accuracy of Information</h2>
          <p>
            While we strive to ensure the accuracy of property listings, Aangan does not guarantee the completeness or accuracy of any property descriptions, pricing, or availability. Users are encouraged to independently verify all details before making any financial commitments.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

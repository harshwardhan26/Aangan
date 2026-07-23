import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Aangan Real Estate',
  description: 'Privacy Policy for Aangan Real Estate.',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="static-page-container" style={{ padding: '80px 20px', maxWidth: '800px', margin: '0 auto', minHeight: '60vh' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Last updated: July 2026</p>
        
        <div className="content-section" style={{ marginBottom: '30px', lineHeight: '1.7' }}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to Aangan. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights.
          </p>
        </div>

        <div className="content-section" style={{ marginBottom: '30px', lineHeight: '1.7' }}>
          <h2>2. The Data We Collect About You</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier (such as your Google OAuth profile), and title.</li>
            <li><strong>Contact Data:</strong> includes email address and telephone numbers, which we use to connect you with property sellers via our Lead system.</li>
            <li><strong>Usage Data:</strong> includes information about how you use our website, properties you view, and properties you save to your profile.</li>
          </ul>
        </div>

        <div className="content-section" style={{ marginBottom: '30px', lineHeight: '1.7' }}>
          <h2>3. How We Use Your Personal Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
            <li>To register you as a new user (via Google Authentication).</li>
            <li>To process and deliver your property inquiries (Leads) directly to the respective sellers or agents.</li>
            <li>To manage your saved properties and dashboard preferences.</li>
          </ul>
          <p style={{ marginTop: '10px', background: '#f1f5f9', padding: '15px', borderRadius: '8px' }}>
            <strong>Note on Lead Generation:</strong> When you click "Contact Agent Now" on a property listing, you explicitly consent to sharing your provided Name, Phone Number, and Email Address with the seller of that specific property.
          </p>
        </div>

        <div className="content-section" style={{ marginBottom: '30px', lineHeight: '1.7' }}>
          <h2>4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. We use secure database providers (Prisma Postgres) to store your information.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
